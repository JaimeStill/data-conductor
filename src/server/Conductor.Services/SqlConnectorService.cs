using System.Data;
using System.Text.Json;
using Conductor.Models.Entities;
using Microsoft.Data.SqlClient;

namespace Conductor.Services;
public class SqlConnectorService : IDisposable
{
    static List<int> TransientErrorNumbers = new()
    {
        4060, 40197, 40501, 40613, 49918, 49919, 49920, 11001
    };

    Connector connector;
    SqlConnection connection;

    public SqlConnectorService(Connector connector)
    {
        this.connector = connector;
        connection = CreateConnection();
    }

    SqlConnection CreateConnection() =>
        new(BuildConnectionString());

    string BuildConnectionString() =>
        new SqlConnectionStringBuilder()
        {
            DataSource = connector.Server,
            InitialCatalog = connector.Database,
            IntegratedSecurity = true,
            ConnectRetryCount = 3,
            ConnectRetryInterval = 4
        }.ConnectionString;

    public Task OpenConnection() => connection.OpenAsync();

    public SqlCommand CreateCommand(string script) =>
        new()
        {
            Connection = connection,
            CommandType = CommandType.Text,
            CommandText = script
        };

    public static async Task<SqlDataReader> Query(SqlCommand command)
    {
        var succeeded = false;
        var retries = 4;
        var retryInterval = 2;
        SqlDataReader reader = null;

        for (var tries = 1; tries <= retries; tries++)
        {
            try
            {
                if (tries > 1)
                {
                    await Task.Delay(1000 * retryInterval);
                    retryInterval = Convert.ToInt32(retryInterval * 1.5);
                }

                reader = await command.ExecuteReaderAsync();
                succeeded = true;
                break;
            }
            catch (SqlException ex)
            {
                if (TransientErrorNumbers.Contains(ex.Number))
                    continue;
                else
                    throw new Exception("SQL error executing query", ex);
            }
            catch (Exception ex)
            {
                throw new Exception("Error executing query", ex);
            }
        }

        if (succeeded)
            return reader;
        else
            throw new Exception("An error occurred executing database query");
    }

    static string Interpolate(string script, string prop, char separator = ':') =>
        script.Replace(
            $"[{prop.Split(separator)[0]}]",
            prop.Split(separator)[1]
        );

    public static string InterpolateScriptProps(string script, string props, char split = ',', char separator = ':')
    {
        string result = script;

        if (props.Contains(split))
        {
            foreach (var prop in props.Split(split))
            {
                if (prop.Contains(separator))
                    result = Interpolate(result, prop, separator);
            }
        }
        else if (props.Contains(separator))
            result = Interpolate(result, props, separator);

        return result;
    }

    public void Dispose()
    {
        connection.Close();
        GC.SuppressFinalize(this);
    }
}

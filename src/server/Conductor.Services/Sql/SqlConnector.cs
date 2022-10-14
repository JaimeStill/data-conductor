using System.Data;
using System.Text.Json.Nodes;
using Conductor.Models.Entities;
using Conductor.Models.Validation;
using Microsoft.Data.SqlClient;

namespace Conductor.Services.Sql;
public static class SqlConnector
{
    static readonly List<int> TransientErrorNumbers = new()
    {
        4060, 40197, 40501, 40613, 49918, 49919, 49920, 11001
    };

    public static async Task<ValidationResult> TestConnector(Connector connector)
    {
        ValidationResult result = new();

        try
        {
            using SqlConnection connection = BuildConnection(connector);
            await connection.OpenAsync();
            
            if (connection.State != ConnectionState.Open)
                result.AddMessage("Unable to connect to the database");

            await connection.CloseAsync();

            return result;
        }
        catch (Exception ex)
        {
            result.AddMessage(ex.Message);
            Exception inner = ex.InnerException;

            while (inner is not null)
            {
                result.AddMessage(inner.Message);
                inner = inner.InnerException;
            }

            return result;
        }
    }

    public static async Task<JsonArray> Execute(Connector connector, string query)
    {
        using SqlConnection connection = BuildConnection(connector);
        using SqlCommand command = BuildCommand(connection, query);
        await connection.OpenAsync();
        SqlDataReader reader = await Query(command);
        return await SqlSerializer.Serialize(reader);
    }

    static SqlConnection BuildConnection(Connector connector) =>
        new(
            new SqlConnectionStringBuilder()
            {
                DataSource = connector.Server,
                InitialCatalog = connector.Database,
                IntegratedSecurity = true,
                TrustServerCertificate = true,
                ConnectRetryCount = 3,
                ConnectRetryInterval = 10
            }.ConnectionString
        );

    static SqlCommand BuildCommand(SqlConnection connection, string query) =>
        new()
        {
            Connection = connection,
            CommandType = CommandType.Text,
            CommandText = query
        };

    static async Task<SqlDataReader> Query(SqlCommand command)
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
}

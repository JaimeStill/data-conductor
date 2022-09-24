using Microsoft.Data.SqlClient;
using System.Text.Json.Nodes;

namespace Conductor.Services.Sql;
public static class SqlSerializer
{
    public static async Task<JsonArray> Serialize(SqlDataReader reader)
    {
        JsonArray results = new();

        if (reader.HasRows)
        {
            while (await reader.ReadAsync())
            {
                JsonObject data = new();

                for (var i = 0; i < reader.VisibleFieldCount; i++)
                    data.Add(
                        EnsureSafeName(data, reader.GetName(i)),
                        JsonValue.Create(reader.GetValue(i))
                    );

                results.Add(data);
            }
        }

        await reader.CloseAsync();
        return results;
    }

    static string EnsureSafeName(JsonObject data, string name, int iteration = 0)
    {
        string check = iteration > 0
            ? $"{name}_{iteration}"
            : name;

        return data.ContainsKey(check)
            ? EnsureSafeName(data, name, ++iteration)
            : check;
    }
}
using System.Text.Json.Nodes;
using Conductor.Models.Entities;
using Conductor.Services.Sql;
// See https://aka.ms/new-console-template for more information

Statement statement = new()
{
    Name = "Product Test",
    Value = "SELECT top (1000)\n\tp.Name as 'name',\n\tp.ProductNumber as 'name',\n\tp.ProductId as 'id'\nFROM [AdventureWorks2019].[Production].[Product] as p\nWHERE p.Name like '%{{search}}%'",
    Connector = new()
    {
        Database = "AdventureWorks2019",
        Server = @".\DevSql",
        Name = "DevSql AdventureWorks"
    }
};

Console.WriteLine(statement.Interpolate("search:black"));
Console.WriteLine();

JsonArray result = await SqlConnector.Execute(statement.Connector, statement.Interpolate("search:black"));

foreach (JsonNode node in result)
    Console.WriteLine(node.ToJsonString());
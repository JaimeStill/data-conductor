using System.Text.Json.Nodes;
using Conductor.Models.Entities;
using Conductor.Services.Sql;
// See https://aka.ms/new-console-template for more information

Connector connector = new()
{
    Database = "AdventureWorks2019",
    Server = @".\DevSql",
    Name = "DevSql AdventureWorks"
};

Statement people = new()
{
    Name = "People Test",
    Value = "SELECT TOP (20)\n\tp.LastName as 'lastName',\n\tp.FirstName as 'firstName',\n\tp.MiddleName as 'middleName'\nFROM [AdventureWorks2019].[Person].[Person] as p\nWHERE p.LastName like '{{lastName}}%' and p.FirstName like '{{firstName}}%'\nORDER BY p.LastName, p.FirstName"
};

Statement products = new()
{
    Name = "Product Test",
    Value = "SELECT top (20)\n\tp.Name as 'name',\n\tp.ProductNumber as 'name',\n\tp.ProductId as 'id'\nFROM [AdventureWorks2019].[Production].[Product] as p\nWHERE p.Name like '%{{search}}%'"
};

await ProcessStatement(connector, people.Interpolate("lastName:s/firstName:ri"));
await ProcessStatement(connector, products.Interpolate("search:black"));

static async Task ProcessStatement(Connector connector, string query)
{
    Console.WriteLine();
    Console.WriteLine(query);
    Console.WriteLine();

    JsonArray result = await SqlConnector.Execute(connector, query);

    foreach (JsonNode node in result)
        Console.WriteLine(node.ToJsonString());
}
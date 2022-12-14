using System.Text.Json.Nodes;
using Conductor.Models.Entities;
using Conductor.Services.Sql;

Connector connector = new()
{
    Database = "AdventureWorks2019",
    Server = @".\DevSql",
    Name = "DevSql AdventureWorks"
};

Query people = new()
{
    Name = "People Test",
    Value = "SELECT TOP (20)\n    p.LastName as 'lastName',\n    p.FirstName as 'firstName',\n    p.MiddleName as 'middleName'\nFROM [AdventureWorks2019].[Person].[Person] as p\nWHERE p.LastName like '{{lastName}}%' and p.FirstName like '{{firstName}}%'\nORDER BY p.LastName, p.FirstName"
};

Query products = new()
{
    Name = "Product Test",
    Value = "SELECT TOP (20)\n    p.Name as 'name',\n    p.ProductNumber as 'name',\n    p.ProductId as 'id'\nFROM [AdventureWorks2019].[Production].[Product] as p\nWHERE p.Name like '%{{search}}%'"
};

await ProcessQuery(connector, people.Interpolate("lastName:s/firstName:ri"));
await ProcessQuery(connector, products.Interpolate("search:black"));

static async Task ProcessQuery(Connector connector, string query)
{
    Console.WriteLine();
    Console.WriteLine(query);
    Console.WriteLine();

    JsonArray result = await SqlConnector.Execute(connector, query);

    foreach (JsonNode node in result)
        Console.WriteLine(node.ToJsonString());
}
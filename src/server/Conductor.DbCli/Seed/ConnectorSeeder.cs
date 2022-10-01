using Conductor.Data;
using Conductor.Models.Entities;

namespace Conductor.DbCli.Seed;
public class ConnectorSeeder : Seeder<Connector, ConductorContext>
{
    public ConnectorSeeder(ConductorContext db) : base(db) { }

    protected override async Task<List<Connector>> Generate()
    {
        List<Connector> connectors = new()
        {
            new()
            {
                Database = "AdventureWorks2019",
                Server = @".\DevSql",
                Name = "AdventureWorks-DevSql",
                Queries = new List<Query>
                {
                    new()
                    {
                        Name = "Search People",
                        Value = "SELECT TOP (20)\n    p.LastName as 'lastName',\n    p.FirstName as 'firstName',\n    p.MiddleName as 'middleName'\nFROM [AdventureWorks2019].[Person].[Person] as p\nWHERE p.LastName like '{{lastName}}%' and p.FirstName like '{{firstName}}%'\nORDER BY p.LastName, p.FirstName"
                    },
                    new()
                    {
                        Name = "Search Products",
                        Value = "SELECT top (20)\n    p.Name as 'name',\n    p.ProductNumber as 'name',\n    p.ProductId as 'id'\nFROM [AdventureWorks2019].[Production].[Product] as p\nWHERE p.Name like '%{{search}}%'"
                    }
                }
            }
        };

        await db.Connectors.AddRangeAsync(connectors);
        await db.SaveChangesAsync();

        return connectors;
    }
}
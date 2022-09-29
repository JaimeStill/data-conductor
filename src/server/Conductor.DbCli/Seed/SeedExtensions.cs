using Conductor.Data;

namespace Conductor.DbCli.Seed;
public static class SeedExtensions
{
    public static async Task Seed(this ConductorContext db)
    {
        Console.WriteLine("Seeding Connectors with Queries");
        ConnectorSeeder connectorSeeder = new(db);
        await connectorSeeder.Seed();

        Console.WriteLine("Seeding Editor configurations");
        EditorSeeder editorSeeder = new(db);
        await editorSeeder.Seed();
    }
}
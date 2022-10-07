using Migrator.Data;

namespace Migrator.DbCli.Seed;
public static class SeedExtensions
{
    public static async Task Seed(this AppDbContext db)
    {
        await Task.CompletedTask;        
    }
}
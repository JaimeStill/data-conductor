using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Migrator.Data;
public class DbManager<T> : IAsyncDisposable
    where T : DbContext
{
    readonly bool destroy;
    public T Context { get; private set; }
    public string Connection => Context.Database.GetConnectionString();

    static string GetConnectionString(string connectionName, bool isUnique)
    {
        IConfiguration config = new ConfigurationBuilder()
            .AddJsonFile("connections.json")
            .AddEnvironmentVariables()
            .Build();

        string connection = config.GetConnectionString(connectionName);

        if (isUnique)
            connection = $"{connection}-{Guid.NewGuid()}";

        return connection;
    }

    static T GetDbContext(string connection)
    {
        var builder = new DbContextOptionsBuilder<T>()
            .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking)
            .UseSqlServer(connection);

        return (T)Activator.CreateInstance(typeof(T), builder.Options);
    }

    public DbManager(
        string connectionName = "App",
        bool destroy = false,
        bool isUnique = false
    )
    {
        this.destroy = destroy;

        Context = GetDbContext(
            GetConnectionString(connectionName, isUnique)
        );
    }

    public Task<bool> Destroy() => Context.Database.EnsureDeletedAsync();

    public async Task<bool> Initialize()
    {
        try
        {
            if (destroy)
                await Destroy();

            await Context.Database.MigrateAsync();

            return true;
        }
        catch
        {
            return false;
        }
    }

    public async ValueTask DisposeAsync()
    {
        if (destroy)
            await Destroy();

        Context.Dispose();
        GC.SuppressFinalize(this);
    }
}
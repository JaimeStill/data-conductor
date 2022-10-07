using Migrator.Data;
using Migrator.DbCli.Seed;

try
{
    string connectionName = args.Length > 0
        ? args[0]
        : "App";

    bool destroy = args.Length > 1
        && bool.Parse(args[1]);

    bool unique = args.Length > 2
        && bool.Parse(args[2]);

    await using DbManager<AppDbContext> manager = new(
        connectionName,
        destroy,
        unique
    );

    Console.WriteLine("Initializing database and applying migrations");
    await manager.Initialize();    
    await manager.Context.Seed();

    Console.WriteLine("Database seeding completed successfully");
}
catch (Exception ex)
{
    throw new Exception("An error occurred while seeding the database", ex);
}
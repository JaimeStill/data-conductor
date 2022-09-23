using System.Reflection;
using Conductor.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Conductor.Data;
public class ConductorContext : DbContext
{
    public DbSet<Connector> Connectors { get; set; }
    public DbSet<Editor> Editors { get; set; }
    public DbSet<Statement> Statements { get; set; }

    public ConductorContext(DbContextOptions<ConductorContext> options) : base(options)
    {
        ChangeTracker.StateChanged += CompleteEntity;
    }

    private void CompleteEntity(object sender, EntityEntryEventArgs e)
    {
        if (e.Entry.Entity is Entity entity)
        {
            switch (e.Entry.State)
            {
                case EntityState.Modified:
                case EntityState.Added:
                    entity.Complete();
                    break;
            }
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(
            Assembly.GetExecutingAssembly()
        );

        modelBuilder
            .Model
            .GetEntityTypes()
            .Where(x => x.BaseType == null)
            .ToList()
            .ForEach(x =>
                modelBuilder
                    .Entity(x.Name)
                    .ToTable(x.DisplayName())
            );
    }
}

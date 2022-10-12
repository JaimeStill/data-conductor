using System.Reflection;
using Personify.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Personify.Data;
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Person> People { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
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

using Conductor.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Conductor.Data.Config;
public class ConnectorConfig : IEntityTypeConfiguration<Connector>
{
    public void Configure(EntityTypeBuilder<Connector> builder)
    {
        builder
            .Property(c => c.Server)
            .HasDefaultValue(@".\DevSql");

        builder
            .Property(c => c.Database)
            .HasDefaultValue("AdventureWorks2019");
    }
}
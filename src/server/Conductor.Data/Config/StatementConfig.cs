using Conductor.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Conductor.Data.Config;
public class StatementConfig : IEntityTypeConfiguration<Statement>
{
    public void Configure(EntityTypeBuilder<Statement> builder)
    {
        builder
            .HasOne(x => x.Connector)
            .WithMany(x => x.Statements)
            .HasForeignKey(x => x.ConnectorId);
    }
}
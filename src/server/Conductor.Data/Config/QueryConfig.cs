using Conductor.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Conductor.Data.Config;
public class QueryConfig : IEntityTypeConfiguration<Query>
{
    public void Configure(EntityTypeBuilder<Query> builder)
    {
        builder
            .HasOne(x => x.Connector)
            .WithMany(x => x.Queries)
            .HasForeignKey(x => x.ConnectorId);
    }
}
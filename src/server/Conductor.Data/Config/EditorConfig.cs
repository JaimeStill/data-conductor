using Conductor.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Conductor.Data.Config;
public class EditorConfig : IEntityTypeConfiguration<Editor>
{
    public void Configure(EntityTypeBuilder<Editor> builder)
    {
        builder
            .Property(e => e.FontSize)
            .HasDefaultValue(14);

        builder
            .Property(e => e.TabSpacing)
            .HasDefaultValue(4);

        builder
            .Property(e => e.Font)
            .HasDefaultValue("Consolas");
    }    
}
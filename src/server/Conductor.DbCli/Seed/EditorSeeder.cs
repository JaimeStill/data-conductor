using Conductor.Data;
using Conductor.Models.Entities;

namespace Conductor.DbCli.Seed;
public class EditorSeeder : Seeder<Editor, ConductorContext>
{
    public EditorSeeder(ConductorContext db) : base(db) { }

    protected override async Task<List<Editor>> Generate()
    {
        List<Editor> editors = new()
        {
            new()
            {
                Font = "Courier New",
                FontSize = 14,
                Name = "Default",
                Padding = 4,
                TabSpacing = 4,
                Resize = false
            }
        };

        await db.Editors.AddRangeAsync(editors);
        await db.SaveChangesAsync();

        return editors;
    }
}
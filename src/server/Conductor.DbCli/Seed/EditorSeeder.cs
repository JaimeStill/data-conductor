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
                Name = "Consolas Default",
                Font = "Consolas",
                FontSize = 14,
                TabSpacing = 4
            }
        };

        await db.Editors.AddRangeAsync(editors);
        await db.SaveChangesAsync();

        return editors;
    }
}
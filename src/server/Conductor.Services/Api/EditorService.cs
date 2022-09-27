using Conductor.Data;
using Conductor.Models.Entities;

namespace Conductor.Services.Api;
public class EditorService : EntityService<Editor>
{
    public EditorService(ConductorContext db) : base(db) { }

    protected override Func<IQueryable<Editor>, string, IQueryable<Editor>> Search =>
        (values, term) =>
            values.Where(x =>
                x.Name.ToLower().Contains(term.ToLower())
                || x.Font.ToLower().Contains(term.ToLower())
            );

    static readonly Editor DefaultEditor = new()
    {
        Font = "Courier New",
        FontSize = 14,
        Name = "Default",
        TabSpacing = 4,
    };

    public async Task<Editor> GetDefaultEditor()
    {
        Editor editor = await GetByUrl(DefaultEditor.Name.ToLower());

        if (editor is null)
            editor = await Save(DefaultEditor);

        return editor;
    }
}
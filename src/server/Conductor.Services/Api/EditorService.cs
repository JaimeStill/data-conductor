using Conductor.Data;
using Conductor.Models.Entities;
using Conductor.Models.Validation;

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
        Padding = 4,
        TabSpacing = 4,
        Resize = false
    };

    public async Task<Editor> GetDefaultEditor()
    {
        Editor editor = await GetByUrl(DefaultEditor.Name.ToLower());

        if (editor is null)
            editor = await Save(DefaultEditor);

        return editor;
    }

    public override async Task<ValidationResult> Validate(Editor editor)
    {
        ValidationResult result = await base.Validate(editor);

        if (string.IsNullOrEmpty(editor.Font))
            result.AddMessage("Editor must specify a Font");

        if (editor.FontSize < 10 || editor.FontSize > 24)
            result.AddMessage("Font Size must be in range 10 - 24");

        if (editor.Padding < 2 || editor.Padding > 16)
            result.AddMessage("Padding must be in range 2 - 16");

        if (editor.TabSpacing < 2 || editor.TabSpacing > 8)
            result.AddMessage("Tab Spacing must be in range 2 - 8");

        return result;
    }
}
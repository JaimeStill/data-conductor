using Conductor.Models.Entities;
using Conductor.Services.Api;
using Microsoft.AspNetCore.Mvc;

namespace Conductor.Api.Controllers;

[Route("api/[controller]")]
public class EditorController : EntityController<Editor>
{
    readonly EditorService editorSvc;

    public EditorController(EditorService svc) : base(svc)
    {
        editorSvc = svc;
    }

    [HttpGet("[action]")]
    public async Task<IActionResult> GetAll() =>
        Ok(await editorSvc.GetAll());

    [HttpGet("[action]")]
    public async Task<IActionResult> GetDefaultEditor() =>
        Ok(await editorSvc.GetDefaultEditor());
}
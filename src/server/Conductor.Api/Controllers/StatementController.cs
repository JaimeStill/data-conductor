using Conductor.Models.Entities;
using Conductor.Models.Query;
using Conductor.Services.Api;
using Microsoft.AspNetCore.Mvc;

namespace Conductor.Api.Controllers;

[Route("api/[controller]")]
public class StatementController : EntityController<Statement>
{
    readonly StatementService statementSvc;
    public StatementController(StatementService svc) : base(svc)
    {
        statementSvc = svc;
    }

    [HttpGet("[action]/{connectorId:int}")]
    public async Task<IActionResult> QueryByConnector(
        [FromRoute] int connectorId,
        [FromQuery] QueryParams queryParams
    ) => Ok(await statementSvc.QueryByConnector(connectorId, queryParams));

    [HttpGet("[action]/{connectorId:int}")]
    public async Task<IActionResult> GetByConnector(
        [FromRoute] int connectorId,
        [FromQuery] string sort = "Name"
    ) => Ok(await statementSvc.GetByConnector(connectorId, sort));
}
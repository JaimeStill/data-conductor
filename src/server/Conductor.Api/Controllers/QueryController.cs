using Conductor.Models.Entities;
using Conductor.Models.Query;
using Conductor.Services.Api;
using Microsoft.AspNetCore.Mvc;

namespace Conductor.Api.Controllers;

[Route("api/[controller]")]
public class QueryController : EntityController<Query>
{
    readonly QueryService querySvc;
    public QueryController(QueryService svc) : base(svc)
    {
        querySvc = svc;
    }

    [HttpGet("[action]/{connectorId:int}")]
    public async Task<IActionResult> QueryByConnector(
        [FromRoute] int connectorId,
        [FromQuery] QueryParams queryParams
    ) => Ok(await querySvc.QueryByConnector(connectorId, queryParams));

    [HttpGet("[action]/{connectorId:int}")]
    public async Task<IActionResult> GetByConnector(
        [FromRoute] int connectorId,
        [FromQuery] string sort = "Name"
    ) => Ok(await querySvc.GetByConnector(connectorId, sort));

    [HttpPost("[action]")]
    [Produces("application/json")]
    public async Task<IActionResult> Execute([FromBody]Query statement) =>
        Ok(await querySvc.Execute(statement));

    [HttpPost("[action]/{*props}")]
    [Produces("application/json")]
    public async Task<IActionResult> ExecuteWithProps(
        [FromBody] Query statement,
        [FromRoute] string props
    ) => Ok(await querySvc.Execute(statement, props));
}
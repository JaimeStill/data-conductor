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

    [HttpGet("[action]/{url}")]
    [Produces("application/json")]
    public async Task<IActionResult> Execute([FromRoute]string url) =>
        Ok(await querySvc.Execute(url));

    [HttpGet("[action]/{url}/{*props}")]
    [Produces("application/json")]
    public async Task<IActionResult> Execute(
        [FromRoute] string url,
        [FromRoute] string props
    ) => Ok(await querySvc.Execute(url, props));

    [HttpPost("[action]")]
    [Produces("application/json")]
    public async Task<IActionResult> Execute([FromBody]Query query) =>
        Ok(await querySvc.Execute(query));

    [HttpPost("[action]/{*props}")]
    [Produces("application/json")]
    public async Task<IActionResult> ExecuteWithProps(
        [FromBody] Query query,
        [FromRoute] string props
    ) => Ok(await querySvc.Execute(query, props));
}
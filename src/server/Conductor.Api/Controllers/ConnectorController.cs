using Conductor.Models.Entities;
using Conductor.Services.Api;
using Microsoft.AspNetCore.Mvc;

namespace Conductor.Api.Controllers;

[Route("api/[controller]")]
public class ConnectorController : EntityController<Connector>
{
    readonly ConnectorService connectorSvc;
    public ConnectorController(ConnectorService svc) : base(svc)
    {
        connectorSvc = svc;
    }

    [HttpPost("[action]")]
    public async Task<IActionResult> ValidateDatabase([FromBody]Connector connector) =>
        Ok(await connectorSvc.ValidateDatabase(connector));
}
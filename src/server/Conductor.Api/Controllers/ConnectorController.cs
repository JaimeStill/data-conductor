using Conductor.Models.Entities;
using Conductor.Services.Api;
using Microsoft.AspNetCore.Mvc;

namespace Conductor.Api.Controllers;

[Route("api/[controller]")]
public class ConnectorController : EntityController<Connector>
{
    public ConnectorController(ConnectorService svc) : base(svc) { }
}
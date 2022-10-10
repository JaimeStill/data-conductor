using Migrator.Models.Entities;
using Migrator.Models.Query;
using Migrator.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Migrator.Api.Controllers;
public abstract class EntityController<T> : ControllerBase where T : Entity
{
    protected readonly IService<T> svc;

    public EntityController(IService<T> svc)
    {
        this.svc = svc;
    }

    [HttpGet("[action]")]
    public virtual async Task<IActionResult> Query([FromQuery]QueryParams queryParams) =>
        Ok(await svc.Query(queryParams));

    [HttpPost("[action]")]
    public virtual async Task<IActionResult> IsMigrated([FromBody]T entity) =>
        Ok(await svc.IsMigrated(entity));

    [HttpPost("[action]")]
    public virtual async Task<IActionResult> Validate([FromBody]T entity) =>
        Ok(await svc.Validate(entity));

    [HttpPost("[action]")]
    public virtual async Task<IActionResult> Save([FromBody]T entity) =>
        Ok(await svc.Save(entity));

    [HttpDelete("[action]")]
    public virtual async Task<IActionResult> Remove([FromBody]T entity) =>
        Ok(await svc.Remove(entity));
}
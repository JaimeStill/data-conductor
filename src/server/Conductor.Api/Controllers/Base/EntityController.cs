using Conductor.Models.Entities;
using Conductor.Models.Query;
using Conductor.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Conductor.Api.Controllers;
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

    [HttpGet("[action]/{id:int}")]
    public virtual async Task<IActionResult> GetById([FromRoute]int id) =>
        Ok(await svc.GetById(id));

    [HttpGet("[action]/{url}")]
    public virtual async Task<IActionResult> GetByUrl([FromRoute]string url) =>
        Ok(await svc.GetByUrl(url));

    [HttpPost("[action]")]
    public virtual async Task<IActionResult> ValidateName([FromBody]T entity) =>
        Ok(await svc.ValidateName(entity));

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
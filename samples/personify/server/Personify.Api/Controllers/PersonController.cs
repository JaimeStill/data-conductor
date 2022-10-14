using Microsoft.AspNetCore.Mvc;
using Personify.Models.Entities;
using Personify.Services.Api;

namespace Personify.Api.Controllers;

[Route("api/[controller]")]
public class PersonController : EntityController<Person>
{
    readonly PersonService personSvc;
    public PersonController(PersonService svc) : base(svc)
    {
        personSvc = svc;
    }

    [HttpPost("[action]")]
    public async Task<IActionResult> Migrate([FromBody] List<Person> people) =>
        Ok(await personSvc.Migrate(people));
}
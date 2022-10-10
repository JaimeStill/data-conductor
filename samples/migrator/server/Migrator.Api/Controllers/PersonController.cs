using Microsoft.AspNetCore.Mvc;
using Migrator.Models.Entities;
using Migrator.Services.Api;

namespace Migrator.Api.Controllers;

[Route("api/[controller]")]
public class PersonController : EntityController<Person>
{
    public PersonController(PersonService svc) : base(svc) { }
}
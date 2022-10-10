using Microsoft.AspNetCore.Mvc;
using Migrator.Models.Entities;
using Migrator.Services.Api;

namespace Migrator.Api.Controllers;

[Route("api/[controller]")]
public class ProductController : EntityController<Product>
{
    readonly ProductService productSvc;

    public ProductController(ProductService svc) : base(svc)
    {
        productSvc = svc;
    }

    [HttpPost("[action]")]
    public async Task<IActionResult> Migrate([FromBody]List<Product> products) =>
        Ok(await productSvc.Migrate(products));
}
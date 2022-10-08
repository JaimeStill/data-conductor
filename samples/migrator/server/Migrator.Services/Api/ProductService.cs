using Migrator.Data;
using Migrator.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Migrator.Models.Validation;

namespace Migrator.Services.Api;
public class ProductService : EntityService<Product>
{
    public ProductService(AppDbContext db) : base(db) { }

    protected override Func<IQueryable<Product>, string, IQueryable<Product>> Search =>
        (values, search) =>
            values.Where(x =>
                x.Category.ToLower().Contains(search.ToLower())
                || x.Model.ToLower().Contains(search.ToLower())
                || x.Name.ToLower().Contains(search.ToLower())
                || x.ProductNumber.ToLower().Contains(search.ToLower())
                || x.SubCategory.ToLower().Contains(search.ToLower())
            );
}
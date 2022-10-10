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

    public override async Task<bool> IsMigrated(Product product) =>
        await db.Products
            .AnyAsync(x =>
                x.Id != product.Id
                && x.LegacyProductId > 0
                && x.LegacyProductId == product.LegacyProductId
            );

    public override async Task<ValidationResult> Validate(Product entity)
    {
        ValidationResult result = new();

        if (entity.Id < 1 && entity.LegacyProductId > 0 && await IsMigrated(entity))
            result.AddMessage("Product has already been migrated");

        if (string.IsNullOrWhiteSpace(entity.Category))
            result.AddMessage("Product must have a Category");

        if (string.IsNullOrWhiteSpace(entity.Model))
            result.AddMessage("Product must have a Model");

        if (string.IsNullOrWhiteSpace(entity.Name))
            result.AddMessage("Product must have a Name");

        if (string.IsNullOrWhiteSpace(entity.ProductNumber))
            result.AddMessage("Product must have a Product Number");

        if (string.IsNullOrWhiteSpace(entity.SubCategory))
            result.AddMessage("Product must have a Sub-Category");

        return result;
    }

    public async Task<int> Migrate(List<Product> products)
    {
        foreach (Product product in products)
        {
            if (!await IsMigrated(product))
                await db.Products.AddAsync(product);
        }

        return await db.SaveChangesAsync();
    }
}
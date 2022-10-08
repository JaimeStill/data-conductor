namespace Migrator.Models.Entities;
public class Product : Entity
{
    public int LegacyProductId { get; set; }
    public int LegacyModelId { get; set; }
    public int LegacySubCategoryId { get; set; }
    public int LegacyCategoryId { get; set; }
    public string Category { get; set; }
    public string Model { get; set; }
    public string Name { get; set; }
    public string ProductNumber { get; set; }
    public string SubCategory { get; set; }
}
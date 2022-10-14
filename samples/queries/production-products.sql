SELECT DISTINCT
    Product.ProductId AS 'legacyProductId',
    Model.ProductModelID AS 'legacyModelId',
    SubCategory.ProductCategoryID AS 'legacySubCategoryId',
    Category.ProductCategoryID AS 'legacyCategoryId',
    Product.Name AS 'name',
    Product.ProductNumber AS 'productNumber',
    Model.Name AS 'model',
    SubCategory.Name AS 'subCategory',
    Category.Name AS 'category'
FROM [AdventureWorks2019].[Production].[Product] AS Product
INNER JOIN [AdventureWorks2019].[Production].[ProductModel] AS Model
ON Product.ProductModelID = Model.ProductModelID
INNER JOIN [AdventureWorks2019].[Production].[ProductSubcategory] AS SubCategory
ON Product.ProductSubcategoryID = Subcategory.ProductSubcategoryID
INNER JOIN [AdventureWorks2019].[Production].[ProductCategory] AS Category
ON SubCategory.ProductCategoryID = Category.ProductCategoryID
ORDER BY Category.Name, Subcategory.Name, Product.ProductNumber
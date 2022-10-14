SELECT TOP (20)
    a.AddressLine1 AS 'addressOne',
    a.AddressLine2 AS 'addressTwo',
    a.City AS 'city',
    s.[Name] AS 'state',
    a.PostalCode AS 'zip'
FROM [AdventureWorks2019].[Person].[Address] AS a
INNER JOIN [AdventureWorks2019].[Person].[StateProvince] AS s
ON a.StateProvinceID = s.StateProvinceID
WHERE a.City like '%dallas%' OR s.[Name] like '%texas%'
ORDER BY s.[Name], a.[City], a.[PostalCode]
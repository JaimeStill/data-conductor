SELECT DISTINCT
    p.LastName as 'lastName',
    p.FirstName as 'firstName',
    p.MiddleName as 'middleName'
FROM [AdventureWorks2019].[Person].[Person] as p
ORDER BY p.LastName, p.FirstName
OFFSET 0 ROWS
FETCH NEXT 200 ROWS ONLY
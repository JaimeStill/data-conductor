SELECT TOP (20)
	p.LastName as 'lastName',
	p.FirstName as 'firstName',
	p.MiddleName as 'middleName'
FROM [AdventureWorks2019].[Person].[Person] as p
WHERE p.LastName LIKE 'sa%' AND p.FirstName LIKE 'ri%'
ORDER BY p.LastName, p.FirstName
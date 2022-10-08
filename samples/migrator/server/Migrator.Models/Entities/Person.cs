namespace Migrator.Models.Entities;
public class Person : Entity
{
    public string LastName { get; set; }
    public string FirstName { get; set; }
    public string MiddleName { get; set; }
}
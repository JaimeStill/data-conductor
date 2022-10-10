namespace Migrator.Models.Entities;
public class Person : Entity
{
    public int LegacyPersonId { get; set; }
    public string LastName { get; set; }
    public string FirstName { get; set; }
    public string MiddleName { get; set; }
}
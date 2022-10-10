using Microsoft.EntityFrameworkCore;
using Migrator.Data;
using Migrator.Models.Entities;
using Migrator.Models.Validation;

namespace Migrator.Services.Api;
public class PersonService : EntityService<Person>
{
    public PersonService(AppDbContext db) : base(db) { }

    protected override Func<IQueryable<Person>, string, IQueryable<Person>> Search =>
        (values, search) =>
            values.Where(x =>
                x.LastName.ToLower().Contains(search.ToLower())
                || x.FirstName.ToLower().Contains(search.ToLower())
                || x.MiddleName.ToLower().Contains(search.ToLower())
            );

    public override async Task<bool> IsMigrated(Person person) =>
        await db.People
            .AnyAsync(x =>
                x.Id != person.Id
                && x.LegacyPersonId > 0
                && x.LegacyPersonId == person.LegacyPersonId
            );

    public override async Task<ValidationResult> Validate(Person entity)
    {
        ValidationResult result = new();

        if (entity.Id < 1 && entity.LegacyPersonId > 0 && await IsMigrated(entity))
            result.AddMessage("Person has already been migrated");

        if (string.IsNullOrWhiteSpace(entity.LastName))
            result.AddMessage("Person must have a Last Name");

        if (string.IsNullOrWhiteSpace(entity.FirstName))
            result.AddMessage("Person must have a First Name");

        return result;
    }
}
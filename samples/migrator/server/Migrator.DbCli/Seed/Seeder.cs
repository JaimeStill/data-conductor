using Migrator.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Migrator.DbCli.Seed;
public abstract class Seeder<E, D> where E : Entity where D : DbContext
{
    protected readonly D db;

    public Seeder(D db)
    {
        this.db = db;
    }

    protected virtual Task<List<E>> Generate() =>
        Task.FromResult(new List<E>());

    public virtual async Task<List<E>> Seed()
    {
        if (await db.Set<E>().AnyAsync())
            return await db.Set<E>().ToListAsync();
        else
            return await Generate();
    }
}
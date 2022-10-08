using Migrator.Data;
using Migrator.Models.Entities;
using Migrator.Models.Query;
using Migrator.Models.Validation;
using Migrator.Services.Exceptions;
using Migrator.Services.Extensions;
using Migrator.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Migrator.Services.Api;
public class EntityService<T> : IService<T> where T : Entity
{
    protected AppDbContext db;
    protected IQueryable<T> query;

    public EntityService(AppDbContext db)
    {
        this.db = db;
        query = db.Set<T>();
    }

    protected virtual Func<IQueryable<T>, string, IQueryable<T>> Search => 
        (values, term) => values;

    protected virtual async Task<QueryResult<E>> Query<E>(
        IQueryable<E> queryable,
        QueryParams queryParams,
        Func<IQueryable<E>, string, IQueryable<E>> search
    ) where E : Entity
    {
        var container = new QueryContainer<E>(
            queryable,
            queryParams
        );

        return await container.Query((data, s) =>
            data.SetupSearch(s, search)
        );
    }

    protected virtual async Task<List<E>> Get<E>(
        IQueryable<E> queryable,
        string sort = "Id"
    ) where E : Entity =>
        await queryable
            .ApplySorting(new QueryOptions { Sort = sort })
            .ToListAsync();

    protected virtual async Task<T> Add(T entity)
    {
        try
        {
            await db.Set<T>().AddAsync(entity);
            await db.SaveChangesAsync();
            return entity;
        }
        catch (Exception ex)
        {
            throw new ServiceException<T>("Add", ex);
        }
    }

    protected virtual async Task<T> Update(T entity)
    {
        try
        {
            db.Set<T>().Update(entity);
            await db.SaveChangesAsync();
            return entity;
        }
        catch (Exception ex)
        {
            throw new ServiceException<T>("Update", ex);
        }
    }

    public virtual async Task<QueryResult<T>> Query(QueryParams queryParams) =>
        await Query(
            query, queryParams, Search
        );

    public virtual async Task<T> GetById(int id) =>
        await query.FirstOrDefaultAsync(x => x.Id == id);

    public virtual Task<ValidationResult> Validate(T entity) =>
        Task.FromResult(new ValidationResult());

    public virtual async Task<T> Save(T entity)
    {
        try
        {
            var validity = await Validate(entity);

            if (validity.IsValid)
                return entity.Id > 0
                    ? await Update(entity)
                    : await Add(entity);
            else
                throw new ServiceException<T>("Save", new Exception(validity.Message));
        }
        catch(Exception ex)
        {
            throw new ServiceException<T>("Save", ex);
        }
    }

    public virtual async Task<int> Remove(T entity)
    {
        try
        {
            db.Set<T>().Remove(entity);
            int result = await db.SaveChangesAsync();

            return result > 0
                ? entity.Id
                : 0;
        }
        catch(Exception ex)
        {
            throw new ServiceException<T>("Remove", ex);
        }
    }
}
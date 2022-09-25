using Conductor.Data;
using Conductor.Models.Entities;
using Conductor.Models.Query;
using Conductor.Models.Validation;
using Conductor.Services.Exceptions;
using Conductor.Services.Extensions;
using Conductor.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Conductor.Services.Api;
public class EntityService<T> : IService<T> where T : Entity
{
    protected ConductorContext db;
    protected DbSet<T> set;
    protected IQueryable<T> query;

    public EntityService(ConductorContext db)
    {
        this.db = db;
        set = db.Set<T>();
        query = SetGraph(set);
    }

    protected virtual Func<IQueryable<T>, string, IQueryable<T>> Search =>
        (values, term) =>
            values;

    protected virtual void ClearGraph(T entity)
    {
        return;
    }

    protected virtual IQueryable<T> SetGraph(DbSet<T> data) =>
        data;

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
        string sort = "Name"
    ) where E : Entity =>
        await queryable
            .ApplySorting(new QueryOptions { Sort = sort })
            .ToListAsync();

    protected virtual async Task<T> Add(T entity)
    {
        try
        {
            await set.AddAsync(entity);
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
            ClearGraph(entity);
            set.Update(entity);
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

    public virtual async Task<T> GetByUrl(string url) =>
        await query.FirstOrDefaultAsync(x => x.Url.ToLower() == url.ToLower());    

    public virtual async Task<bool> ValidateName(T entity) =>
        !await set.AnyAsync(x =>
            x.Id != entity.Id
            && x.Name.ToLower() == entity.Name.ToLower()
        );

    public virtual async Task<ValidationResult> Validate(T entity)
    {
        ValidationResult result = new();

        if (string.IsNullOrEmpty(entity.Name))
            result.AddMessage("Name is required");

        if (!await ValidateName(entity))
            result.AddMessage("Name is already in use");

        return result;
    }

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
            set.Remove(entity);
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
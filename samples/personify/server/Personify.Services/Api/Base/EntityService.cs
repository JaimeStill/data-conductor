using Microsoft.AspNetCore.SignalR;
using Personify.Data;
using Personify.Hubs;
using Personify.Models.Entities;
using Personify.Models.Query;
using Personify.Models.Validation;
using Personify.Services.Exceptions;
using Personify.Services.Extensions;
using Personify.Services.Interfaces;

namespace Personify.Services.Api;
public class EntityService<T> : IService<T> where T : Entity
{
    protected AppDbContext db;
    protected readonly IHubContext<MigrationHub> hub;
    protected IQueryable<T> query;

    public EntityService(AppDbContext db, IHubContext<MigrationHub> hub)
    {
        this.db = db;
        this.hub = hub;
        query = db.Set<T>();
    }

    protected virtual string Label(T entity) => "Data";

    protected async Task Broadcast(string message, string style = "color-text") =>
        await hub
            .Clients
            .All
            .SendAsync("output", new MigrationOutput { Message = message, Style = style });

    protected async Task BroadcastSuccess(T entity, string op) =>
        await Broadcast($"{Label(entity)} successfully {op}", "color-primary");

    protected async Task BroadcastException(Exception ex)
    {
        if (ex is not null)
        {
            await Broadcast(ex.Message, "color-warn");
            await BroadcastException(ex.InnerException);
        }
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

    protected virtual async Task<T> Add(T entity)
    {
        try
        {
            await db.Set<T>().AddAsync(entity);
            await db.SaveChangesAsync();
            await BroadcastSuccess(entity, "added");
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
            await BroadcastSuccess(entity, "updated");
            return entity;
        }
        catch (Exception ex)
        {
            await BroadcastException(ex);
            throw new ServiceException<T>("Update", ex);
        }
    }

    public virtual async Task<QueryResult<T>> Query(QueryParams queryParams) =>
        await Query(
            query, queryParams, Search
        );

    public virtual Task<bool> IsMigrated(T entity) =>
        Task.FromResult(false);

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
                await Broadcast(validity.Message, "color-warn");

            return null;
        }
        catch (Exception ex)
        {
            await BroadcastException(ex);
            throw new ServiceException<T>("Save", ex);
        }
    }

    public virtual async Task<int> Remove(T entity)
    {
        try
        {
            db.Set<T>().Remove(entity);
            int result = await db.SaveChangesAsync();

            if (result > 0)
            {
                await BroadcastSuccess(entity, "removed");
                return entity.Id;
            }
            else
            {
                await Broadcast($"An error occurred removing {Label(entity)}");
                return 0;
            }
        }
        catch (Exception ex)
        {
            await BroadcastException(ex);
            throw new ServiceException<T>("Remove", ex);
        }
    }
}
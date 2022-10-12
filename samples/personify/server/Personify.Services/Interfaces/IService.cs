using Personify.Models.Entities;
using Personify.Models.Query;
using Personify.Models.Validation;

namespace Personify.Services.Interfaces;
public interface IService<T> where T : Entity
{
    Task<QueryResult<T>> Query(QueryParams queryParams);
    Task<bool> IsMigrated(T entity);
    Task<ValidationResult> Validate(T entity);
    Task<T> Save(T entity);
    Task<int> Remove(T entity);
}
using Migrator.Models.Entities;
using Migrator.Models.Query;
using Migrator.Models.Validation;

namespace Migrator.Services.Interfaces;
public interface IService<T> where T : Entity
{
    Task<QueryResult<T>> Query(QueryParams queryParams);
    Task<T> GetById(int id);
    Task<T> GetByUrl(string url);
    Task<bool> ValidateName(T entity);
    Task<ValidationResult> Validate(T entity);
    Task<T> Save(T entity);
    Task<int> Remove(T entity);
}
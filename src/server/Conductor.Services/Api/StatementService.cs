using Conductor.Data;
using Conductor.Models.Entities;
using Conductor.Models.Query;
using Conductor.Models.Validation;
using Microsoft.EntityFrameworkCore;

namespace Conductor.Services.Api;
public class StatementService : EntityService<Statement>
{
    public StatementService(ConductorContext db) : base(db) { }

    protected override Func<IQueryable<Statement>, string, IQueryable<Statement>> Search =>
        (values, term) =>
            values.Where(x =>
                x.Name.ToLower().Contains(term.ToLower())
            );

    protected override void ClearGraph(Statement entity)
    {
        entity.Connector = null;
    }

    protected override IQueryable<Statement> SetGraph(DbSet<Statement> data) =>
        data.Include(x => x.Connector);

    public async Task<QueryResult<Statement>> QueryByConnector(
        int connectorId,
        QueryParams queryParams
    ) => await Query(
        query.Where(x => x.ConnectorId == connectorId),
        queryParams, Search
    );

    public async Task<List<Statement>> GetByConnector(
        int connectorId,
        string sort = "Name"
    ) => await Get(
        query.Where(x => x.ConnectorId == connectorId),
        sort
    );

    public override async Task<ValidationResult> Validate(Statement entity)
    {
        ValidationResult result = await base.Validate(entity);

        if (entity.ConnectorId < 1)
            result.AddMessage("Statement must be associated with a Connector");

        if (string.IsNullOrEmpty(entity.Value))
            result.AddMessage("Statement must have a Value");

        return result;
    }
}
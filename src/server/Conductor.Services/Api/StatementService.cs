using System.Text.Json.Nodes;
using Conductor.Data;
using Conductor.Models.Entities;
using Conductor.Models.Query;
using Conductor.Models.Validation;
using Conductor.Services.Sql;
using Microsoft.EntityFrameworkCore;

namespace Conductor.Services.Api;
public class StatementService : EntityService<Statement>
{
    public StatementService(ConductorContext db) : base(db) { }

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

    public async Task<JsonArray> Execute(Statement statement, string props = null)
    {
        Connector connector = statement.Connector
            ?? await db.Connectors.FindAsync(statement.ConnectorId);

        string query = string.IsNullOrWhiteSpace(props)
            ? statement.Value
            : statement.Interpolate(props);

        if (connector is not null)
            return await SqlConnector.Execute(
                connector, query
            );

        return null;
    }

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
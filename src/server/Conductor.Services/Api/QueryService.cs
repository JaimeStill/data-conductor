using System.Text.Json.Nodes;
using Conductor.Data;
using Conductor.Models.Entities;
using Conductor.Models.Query;
using Conductor.Models.Validation;
using Conductor.Services.Sql;
using Microsoft.EntityFrameworkCore;

namespace Conductor.Services.Api;
public class QueryService : EntityService<Query>
{
    public QueryService(ConductorContext db) : base(db) { }

    protected override void ClearGraph(Query query)
    {
        query.Connector = null;
    }

    protected override IQueryable<Query> SetGraph(DbSet<Query> data) =>
        data.Include(x => x.Connector);

    protected override Func<IQueryable<Query>, string, IQueryable<Query>> Search =>
        (values, search) =>
            values.Where(x =>
                x.Name.ToLower().Contains(search.ToLower())
                || x.Connector.Server.ToLower().Contains(search.ToLower())
                || x.Connector.Database.ToLower().Contains(search.ToLower())
            );

    public async Task<QueryResult<Query>> QueryByConnector(
        int connectorId,
        QueryParams queryParams
    ) => await Query(
        query.Where(x => x.ConnectorId == connectorId),
        queryParams, Search
    );

    public async Task<List<Query>> GetByConnector(
        int connectorId,
        string sort = "Name"
    ) => await Get(
        query.Where(x => x.ConnectorId == connectorId),
        sort
    );

    public async Task<JsonArray> Execute(Query query, string props = null)
    {
        Connector connector = query.Connector
            ?? await db.Connectors.FindAsync(query.ConnectorId);

        string q = string.IsNullOrWhiteSpace(props)
            ? query.Value
            : query.Interpolate(props);

        if (connector is not null)
            return await SqlConnector.Execute(
                connector, q
            );

        return null;
    }

    public override async Task<ValidationResult> Validate(Query query)
    {
        ValidationResult result = await base.Validate(query);

        if (query.ConnectorId < 1)
            result.AddMessage("Query must be associated with a Connector");

        if (string.IsNullOrEmpty(query.Value))
            result.AddMessage("Query must have a Value");

        return result;
    }
}
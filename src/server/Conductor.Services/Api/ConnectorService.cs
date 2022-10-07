using Conductor.Data;
using Conductor.Models.Entities;
using Conductor.Models.Query;
using Conductor.Models.Validation;
using Microsoft.EntityFrameworkCore;

namespace Conductor.Services.Api;
public class ConnectorService : EntityService<Connector>
{
    public ConnectorService(ConductorContext db) : base(db) { }

    protected override Func<IQueryable<Connector>, string, IQueryable<Connector>> Search =>
        (values, term) =>
            values.Where(x =>
                x.Name.ToLower().Contains(term.ToLower())
                || x.Database.ToLower().Contains(term.ToLower())
                || x.Server.ToLower().Contains(term.ToLower())
            );

    public async Task<bool> ValidateDatabase(Connector connector) =>
        !await db.Connectors
            .AnyAsync(x =>
                x.Id != connector.Id
                && x.Server.ToLower() == connector.Server
                && x.Database.ToLower() == connector.Database.ToLower()
            );

    public async Task<List<Connector>> GetAll(string sort = "Name") =>
        await Get(query, sort);

    public override async Task<ValidationResult> Validate(Connector entity)
    {
        ValidationResult result = await base.Validate(entity);

        if (string.IsNullOrEmpty(entity.Server))
            result.AddMessage("Connector must specify a Server");

        if (string.IsNullOrEmpty(entity.Database))
            result.AddMessage("Connector must specify a Database");

        if (!await ValidateDatabase(entity))
            result.AddMessage($"A Connector to ${entity.Server}.${entity.Database} already exists");

        return result;
    }
}
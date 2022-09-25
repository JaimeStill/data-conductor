using Conductor.Data;
using Conductor.Models.Entities;

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
}
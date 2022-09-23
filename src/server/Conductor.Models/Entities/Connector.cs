namespace Conductor.Models.Entities;
public class Connector : Entity
{
    public string Server { get; set; }
    public string Database { get; set; }

    public ICollection<Statement> Statements { get; set; }
}

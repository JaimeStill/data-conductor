namespace Conductor.Models.Entities;
public class Statement : Entity
{
    public int ConnectorId { get; set; }
    public string Value { get; set; }

    public Connector Connector { get; set; }    
}
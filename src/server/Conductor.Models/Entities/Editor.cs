namespace Conductor.Models.Entities;
public class Editor : Entity
{
    public string Color { get; set; }
    public string Font { get; set; }
    public int FontSize { get; set; }
    public int Padding { get; set; }
    public int TabSpacing { get; set; }
    public bool Resize { get; set; }
}
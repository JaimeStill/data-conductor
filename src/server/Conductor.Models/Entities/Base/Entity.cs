using Conductor.Models.Url;

namespace Conductor.Models.Entities;
public abstract class Entity
{
    public int Id { get; set; }
    public string Url { get; private set; }
    public string Name { get; set; }

    protected static string Encode(string prop) => UrlEncoder.Encode(prop);

    public virtual void Complete() => Url = Encode(Name);
}
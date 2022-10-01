using System.Text.RegularExpressions;

namespace Conductor.Models.Entities;
public class Query : Entity
{
    public int ConnectorId { get; set; }
    public string Value { get; set; }
    public bool Interpolated { get; set; }

    public Connector Connector { get; set; }

    public string Interpolate(string props)
    {
        string result = Value;

        if (props.Contains('/'))
        {
            foreach (var prop in props.Split('/'))
            {
                if (prop.Contains(':'))
                    result = Interpolate(result, prop);                    
            }
        }
        else if (props.Contains(':'))
            result = Interpolate(result, props);

        return result;
    }

    static string Interpolate(string script, string prop) =>
        script.Replace(
            $"{{{{{prop.Split(':')[0]}}}}}",
            prop.Split(':')[1]
        );

    static bool IsInterpolated(string value) =>
        Regex.IsMatch(value, @"{{.*}}");

    public override void Complete()
    {
        Interpolated = IsInterpolated(Value);
        base.Complete();
    }
}
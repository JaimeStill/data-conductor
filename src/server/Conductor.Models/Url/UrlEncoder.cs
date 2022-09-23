using System.Text.RegularExpressions;

namespace Conductor.Models.Url;
public static class UrlEncoder
{
    public static readonly string urlPattern = "[^a-zA-Z0-9-.]";

    public static string Encode(string url) =>
        Encode(url, urlPattern, "-");

    public static string Encode(string url, string pattern, string replace = "") =>
        Regex.Replace(
            Regex.Replace(url, @"\s", replace).ToLower(),
            pattern, replace
        );
}
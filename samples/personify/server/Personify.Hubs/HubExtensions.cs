using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;

namespace Personify.Hubs;
public static class HubExtensions
{
    public static void MapHubs(this IEndpointRouteBuilder app)
    {
        app.MapHub<MigrationHub>("/migration-socket");
    }
}
using Microsoft.Extensions.DependencyInjection;

namespace Conductor.Services.Api;
public static class ServiceRegistrant
{
    public static void AddAppServices(this IServiceCollection services)
    {
        services.AddScoped<ConnectorService>();        
    }    
}
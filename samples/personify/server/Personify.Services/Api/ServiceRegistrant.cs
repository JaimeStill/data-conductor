using Microsoft.Extensions.DependencyInjection;

namespace Personify.Services.Api;
public static class ServiceRegistrant
{
    public static void AddAppServices(this IServiceCollection services)
    {
        services.AddScoped<PersonService>();
    }
}
using Microsoft.Extensions.DependencyInjection;

namespace Migrator.Services.Api;
public static class ServiceRegistrant
{
    public static void AddAppServices(this IServiceCollection services)
    {
        services.AddScoped<PersonService>();
        services.AddScoped<ProductService>();
    }
}
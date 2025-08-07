﻿using AutoMapper;
using Humanizer.Configuration;
using itsc_dotnet_practice.Data;
using itsc_dotnet_practice.Document;
using itsc_dotnet_practice.Document.Interface;
using itsc_dotnet_practice.Models.Mapper;
using itsc_dotnet_practice.Repositories;
using itsc_dotnet_practice.Repositories.Interface;
using itsc_dotnet_practice.Seeds;
using itsc_dotnet_practice.Services;
using itsc_dotnet_practice.Services.Interface;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using OpenTelemetry;
using Serilog;
using System;
using System.Diagnostics;
using System.Text;
using System.Collections.Generic;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);
//if (!builder.Environment.IsDevelopment())
//{
//    builder.WebHost.UseSentry();
//}

// Read DB & JWT values with defaults to avoid errors


string jwtKey = builder.Configuration["JWT_KEY"] ?? "your_jwt_secret_key";
string jwtIssuer = builder.Configuration["JWT_ISSUER"] ?? "your_issuer";
string jwtAudience = builder.Configuration["JWT_AUDIENCE"] ?? "your_audience";
IConfiguration configuration = builder.Configuration;

// Register DB context
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
String connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")).LogTo(message => Debug.WriteLine(message)));

// Register AutoMapper with your UserProfile
builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<UserProfile>();
    cfg.AddProfile<OrderProfile>();
});

// Register repositories and services
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();

// Register your custom Document service for Swagger
builder.Services.AddSingleton<IDocument, Document>();

// Configure JWT Bearer Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new()
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

// Register HttpClient for external API calls (e.g., Pokémon API)
builder.Services.AddHttpClient();
builder.Services.AddHealthChecks();
builder.Host.UseSerilog((hostingContext, loggerConfiguration) => loggerConfiguration
       .ReadFrom.Configuration(hostingContext.Configuration)
       .WriteTo.OpenTelemetry(options =>
       {
           options.Endpoint = $"{configuration.GetValue<string>("Otlp:Endpoint")}/v1/logs";
           options.Protocol = Serilog.Sinks.OpenTelemetry.OtlpProtocol.Grpc;
           options.ResourceAttributes = new Dictionary<string, object>
           {
               ["service.name"] = configuration.GetValue<string>("Otlp:ServiceName")
           };
       }));
Action<ResourceBuilder> appResourceBuilder =
resource => resource
    .AddTelemetrySdk()
    .AddService(configuration.GetValue<string>("Otlp:ServiceName"));
builder.Services.AddOpenTelemetry()
.ConfigureResource(appResourceBuilder)
.WithTracing(builder => builder
    .AddAspNetCoreInstrumentation()
    .AddHttpClientInstrumentation()
     .AddEntityFrameworkCoreInstrumentation(options =>
     {
         options.EnrichWithIDbCommand = (activity, command) =>
         {
             var stateDisplayName = $"{command.CommandText}";
             activity.DisplayName = stateDisplayName;
             activity.SetTag("db.name", stateDisplayName);
         };
     })
    .AddConsoleExporter()
    .AddSource("APITracing")
    //.AddConsoleExporter()
    .AddOtlpExporter(options => options.Endpoint = new Uri(configuration.GetValue<string>("Otlp:Endpoint")))
)
.WithMetrics(builder => builder
    .AddRuntimeInstrumentation()
    .AddAspNetCoreInstrumentation()
                .AddMeter("Microsoft.AspNetCore.Hosting")
.AddMeter("Microsoft.AspNetCore.Server.Kestrel")
// Metrics provided by System.Net libraries
.AddMeter("System.Net.Http")
.AddMeter("System.Net.NameResolution")
.AddPrometheusExporter()
    .AddOtlpExporter(options => options.Endpoint = new Uri(configuration.GetValue<string>("Otlp:Endpoint"))));

// Authorization & Controllers
builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Configure Swagger with your Document class providing security schemes
builder.Services.AddSwaggerGen(options =>
{
    // Build a service provider temporarily to get the Document instance
    using var serviceProvider = builder.Services.BuildServiceProvider();
    var documentService = serviceProvider.GetRequiredService<IDocument>();
    var openApiDoc = documentService.GetOpenApiDocument();

    options.SwaggerDoc("v1", openApiDoc.Info);

    // Add BasicAuth and BearerAuth security definitions from your Document class
    foreach (var scheme in openApiDoc.Components.SecuritySchemes)
    {
        options.AddSecurityDefinition(scheme.Key, scheme.Value);
    }

    // Add security requirements (combined)
    foreach (var requirement in openApiDoc.SecurityRequirements)
    {
        options.AddSecurityRequirement(requirement);
    }

    // Avoid schema ID conflicts (nested classes)
    options.CustomSchemaIds(type => type.FullName.Replace("+", "."));
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

var app = builder.Build();

// Enable Swagger UI (enable in all environments or restrict with IsDevelopment if you want)
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "ITSC .NET Practice API v1");
});

// Apply pending EF Core migrations on startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var db = services.GetRequiredService<AppDbContext>();
    db.Database.Migrate();

    // Seed users
    UserSeeder.Seed(db);

    // Seed products from Pokémon API
    await ProductSeeder.Seed(services);
}
app.UseSerilogRequestLogging();
app.MapPrometheusScrapingEndpoint();
app.MapHealthChecks("/health", new HealthCheckOptions
{
    AllowCachingResponses = false,
    ResultStatusCodes =
                {
                    [HealthStatus.Healthy] = StatusCodes.Status200OK,
                    [HealthStatus.Degraded] = StatusCodes.Status200OK,
                    [HealthStatus.Unhealthy] = StatusCodes.Status503ServiceUnavailable
                }
});
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();


app.Run();
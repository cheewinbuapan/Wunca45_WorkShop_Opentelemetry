﻿using DotNetEnv;
using AutoMapper;
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
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System;
using System.Text;
using Microsoft.Extensions.Configuration;
using System.Diagnostics;

var builder = WebApplication.CreateBuilder(args);
IConfiguration configuration = builder.Configuration;
// Load .env variables
Env.Load();

// Read DB & JWT values with defaults to avoid errors


String jwtKey = configuration.GetValue<string>("Jwt:Key");
String jwtIssuer = configuration.GetValue<string>("Jwt:Issuer");
String jwtAudience = configuration.GetValue<string>("Jwt:Audience");
// Register DB context

String connectionString = configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")).LogTo(message => Debug.WriteLine(message)));
// Register AutoMapper with your UserProfile
builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<UserProfile>();
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

// Authorization & Controllers
builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});
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
    await ProductSeeder.SeedAsync(services);
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.UseCors("AllowAll");
app.Run();
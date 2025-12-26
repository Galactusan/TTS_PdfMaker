# .NET Aspire Integration Guide

This document explains how to integrate this frontend project into a .NET Aspire solution.

## Overview

This React frontend is designed to work seamlessly with .NET Aspire orchestration. The frontend communicates with the backend API service through Aspire's service discovery.

## Prerequisites

- .NET Aspire AppHost project
- Backend API service registered in Aspire
- Docker (for containerized deployment)

## Integration Steps

### 1. Add Frontend Project to Aspire AppHost

In your Aspire `AppHost.cs` (or `Program.cs`), add the frontend project:

```csharp
var frontend = builder.AddProject<Projects.YourFrontendProject>("frontend")
    .WithReference(backend) // Reference your backend project
    .WithEnvironment("VITE_API_BASE_URL", backend.GetEndpoint("http")); // Or use service discovery
```

Or if using Docker:

```csharp
var frontend = builder.AddDockerfile("frontend", "../tts_pdfmaker.frontend/Dockerfile")
    .WithReference(backend)
    .WithEnvironment("VITE_API_BASE_URL", backend.GetEndpoint("http"));
```

### 2. Service Discovery Configuration

The frontend uses `VITE_API_BASE_URL` environment variable to connect to the backend. Aspire can inject this automatically:

```csharp
var frontend = builder.AddDockerfile("frontend", "../tts_pdfmaker.frontend/Dockerfile")
    .WithReference(backend)
    .WithEnvironment("VITE_API_BASE_URL", backend.GetEndpoint("http"));
```

### 3. Backend CORS Configuration

Ensure your backend allows requests from the frontend. In your backend `Program.cs`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            // Allow all localhost origins in development
            policy.SetIsOriginAllowed(origin =>
            {
                var uri = new Uri(origin);
                return uri.Host == "localhost" || uri.Host == "127.0.0.1";
            })
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
        }
        else
        {
            // Production: Use Aspire service URLs
            var frontendUrl = builder.Configuration["Services:Frontend:Url"] 
                ?? "http://frontend:80";
            
            policy.WithOrigins(frontendUrl)
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();
        }
    });
});

// After builder.Build()
app.UseCors("AllowFrontend");
```

### 4. Environment Variables

The frontend expects the following environment variables:

- `VITE_API_BASE_URL`: Backend API base URL (e.g., `http://backend:5047`)

**Important:** Vite embeds environment variables at build time. For runtime configuration:

1. **Option A (Recommended for Aspire):** Set `VITE_API_BASE_URL` at build time via Docker build args
2. **Option B:** Use relative URLs and configure a reverse proxy in Aspire
3. **Option C:** Use the runtime injection script in Dockerfile (limited support)

### 5. Docker Build Configuration

When building with Aspire, ensure the API URL is set via build argument:

```csharp
var frontend = builder.AddDockerfile("frontend", "../tts_pdfmaker.frontend/Dockerfile")
    .WithBuildArg("VITE_API_BASE_URL", backend.GetEndpoint("http"))
    .WithReference(backend);
```

Or if your backend endpoint is named differently:

```csharp
var frontend = builder.AddDockerfile("frontend", "../tts_pdfmaker.frontend/Dockerfile")
    .WithBuildArg("VITE_API_BASE_URL", "http://backend:5047")
    .WithReference(backend);
```

**Important:** Vite requires environment variables at build time, so `VITE_API_BASE_URL` must be passed as a build argument, not a runtime environment variable.

### 6. Port Configuration

- **Frontend:** Exposes port 80 (container) - Aspire will map to available port
- **Backend:** Exposes port 5047 (adjust as needed)

### 7. Health Checks

The frontend container includes nginx health check support. Aspire can verify health:

```csharp
var frontend = builder.AddDockerfile("frontend", "../tts_pdfmaker.frontend/Dockerfile")
    .WithHttpEndpoint(port: 80)
    .WithHealthCheck("/"); // nginx serves index.html
```

## Development Workflow

### Local Development (without Docker)

1. Set `VITE_API_BASE_URL=http://localhost:5047` in `.env.local`
2. Run `npm run dev`
3. Frontend runs on `http://localhost:52913`

### Aspire Development

1. Run your Aspire AppHost project
2. Aspire will build and orchestrate both frontend and backend
3. Access frontend through Aspire dashboard

### Production Deployment

1. Build frontend: `docker build -t frontend .`
2. Or let Aspire handle orchestration
3. Ensure CORS is configured for production URLs

## Troubleshooting

### CORS Errors

- Verify backend CORS configuration allows frontend origin
- Check that `VITE_API_BASE_URL` matches backend service URL
- Ensure services are on the same network in Docker

### API Connection Issues

- Verify `VITE_API_BASE_URL` is set correctly
- Check Aspire service discovery configuration
- Verify backend is running and accessible

### Build Issues

- Ensure `VITE_API_BASE_URL` is set at build time (Vite requirement)
- Check Docker build context includes all necessary files
- Verify `.dockerignore` doesn't exclude required files

## File Structure

```
tts_pdfmaker.frontend/
├── Dockerfile              # Multi-stage build for production
├── docker-compose.yml      # Reference compose file (optional)
├── nginx.conf              # Nginx configuration for SPA
├── .dockerignore           # Docker build exclusions
├── src/
│   └── services/
│       └── api.ts          # API service (uses VITE_API_BASE_URL)
└── ASPIRE_INTEGRATION.md   # This file
```

## Additional Notes

- The frontend is a Single Page Application (SPA) - nginx is configured to serve `index.html` for all routes
- Static assets are cached for 1 year (configured in `nginx.conf`)
- Gzip compression is enabled for better performance
- The Dockerfile uses multi-stage build for optimal image size


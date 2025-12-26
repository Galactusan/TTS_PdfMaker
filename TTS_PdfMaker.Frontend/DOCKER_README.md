# Docker Configuration Summary

## Quick Reference

### Build the Frontend Image

```bash
# Local development (uses localhost:5047)
docker build -t tts-pdfmaker-frontend .

# With custom API URL
docker build --build-arg VITE_API_BASE_URL=http://backend:5047 -t tts-pdfmaker-frontend .
```

### Run with Docker Compose

```bash
docker-compose up --build
```

### For .NET Aspire Integration

See `ASPIRE_INTEGRATION.md` for detailed Aspire setup instructions.

## Key Files

- **Dockerfile**: Multi-stage build (Node.js build → Nginx serve)
- **docker-compose.yml**: Reference compose file for local testing
- **nginx.conf**: Nginx configuration for SPA routing and optimization
- **.dockerignore**: Files excluded from Docker build context

## Environment Variables

- `VITE_API_BASE_URL`: Backend API base URL (required at build time)

## Ports

- **Container**: 80 (nginx)
- **Host**: 52913 (in docker-compose.yml, configurable in Aspire)

## Notes

- The Dockerfile uses multi-stage build for optimal image size
- Health check is included for Aspire compatibility
- Nginx is configured for SPA routing (all routes serve index.html)
- Static assets are cached for 1 year
- Gzip compression is enabled


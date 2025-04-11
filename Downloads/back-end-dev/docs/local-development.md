# Local Development Guide

## Overview

All services for local development are set up using [docker-compose.yml](../docker-compose.yml) and built with the [Dockerfile](../Dockerfile).

## Prerequisites

- Docker
- Node.js
- pnpm

## Installation Instructions

1. **Install Docker**: [Docker Installation Guide](https://docs.docker.com/get-docker/)
2. **Install Node.js**: [Node.js Installation Guide](https://nodejs.org/)
3. **Install pnpm**: [pnpm Installation Guide](https://pnpm.io/installation)

## Configuration

### Environment Variables

- `NODE_ENV`: Environment setting (`local`, `development`, `production`)
- `APP_NAME`: Name of the service

### Example .env File

```sh
NODE_ENV=local
APP_NAME=service_name
```

## Commands

### Start All Services in Docker

```sh
docker-compose up -d
```

### Stop All Services in Docker

```sh
docker-compose down
```

### Check Logs of All Services

```sh
docker-compose logs
```

### Check Logs of a Single Service

```sh
docker-compose logs <service name>
```

### Stream Logs in Console

```sh
docker-compose logs <service name> -f
```

### Restart Gateway

If you change the GraphQL schema in a service, restart the gateway manually:

```sh
docker-compose restart gateway
```

### Start Service Not in Container

```sh
NODE_ENV=local APP_NAME=<service name> pnpm start <service name>
```

### Build Service

```sh
NODE_ENV=local APP_NAME=<service name> pnpm build <service name>
```

## Testing

### Running Tests

```sh
pnpm test
```

## Common Issues and Troubleshooting

### Common Errors

- **Error: Docker not found**: Ensure Docker is installed and running.
- **Error: pnpm command not found**: Ensure pnpm is installed and added to your PATH.

### FAQ

- **Q: How do I update a service?**
  - A: Make the necessary code changes and restart the service using `docker-compose restart <service name>`.

## Useful Links

- [Docker Documentation](https://docs.docker.com/)
- [pnpm Documentation](https://pnpm.io/)

This comprehensive guide should help developers set up their local environment and contribute effectively.

# Back-end API

## Documentation

For detailed information about the project architecture and implementation, please refer to the following documentation:

- [Core Conceptions](docs/core-conceptions.md) - Describes the core architectural principles and patterns used in the project
- [Microservices Communication](docs/microservices-communication.md) - Details about inter-service communication, event bus, and RPC implementation
- [Database and Architecture](docs/database-and-architecture.md) - Comprehensive guide on database management, logical replication, and system architecture
- [Scripts](docs/scripts.md) - Documentation for all utility scripts in the project
- [Local Development](docs/local-development.md) - Guide for setting up and running the project locally
- [Testing](docs/testing.md) - Information about testing strategies and running tests

## Technologies

- [NestJS](https://docs.nestjs.com) - A progressive Node.js framework for building efficient and scalable server-side applications
- [pnpm](https://pnpm.io/pnpm-cli) - Fast, disk space efficient package manager
- [Docker](https://docs.docker.com/get-started/get-docker) - Platform for developing, shipping, and running applications

## Getting Started

### Start back end

> [!NOTE]
> If docker is not installed, read documentation on how to install Docker for your platform

```sh
docker-compose up
```

### First setup after cloning repository locally for development

```sh
npm i -g pnpm
pnpm i
```

### Make all files executable

```sh
find . -type f -name "*.sh" -exec chmod +x {} +
```

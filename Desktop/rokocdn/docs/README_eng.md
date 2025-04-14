# RokoCDN Documentation

This directory contains documentation for the RokoCDN project - a CDN resource management system.

## Documentation Structure

- [**Diagrams**](diagrams/README_eng.md) - a set of Mermaid diagrams that represent various aspects of the architecture and functionality of the system.

## About RokoCDN Project

RokoCDN is a full-stack web application for managing CDN resources. It provides a comprehensive solution for managing projects, servers, domains, DNS records, configurations, and other aspects of CDN.

### Architecture

The project follows a modern microservices architecture:

```
Frontend (Vue + Vuetify) <---> Backend (NestJS) <---> Database (PostgreSQL)
```

#### Frontend
- Built with Vue 3 and Composition API
- Uses Vuetify 3 for UI components
- Responsive design with a navigation drawer, app bar, and content area
- State management with Pinia

#### Backend
- Built with NestJS
- Uses TypeORM for database interactions with PostgreSQL
- RESTful API endpoints for all entities
- JWT authentication
- Modular architecture with separate modules for each entity type

#### Database
- PostgreSQL database
- Entity relationships as defined in the schema

### Features

- User authentication and authorization
- Project management
- Server management
- Domain management
- DNS record management
- Configuration management
- Deployment job management
- Logging
- Redirector management
- Tag management

### Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- npm or pnpm (for local development)

### Getting Started

#### Using Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/rokocdn.git
   cd rokocdn
   ```

2. Start the application using Docker Compose:
   ```bash
   make up
   ```
   or
   ```bash
   docker-compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3000/api

#### Local Development

##### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your configuration.

4. Start the development server:
   ```bash
   pnpm run start:dev
   ```

##### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your configuration.

4. Start the development server:
   ```bash
   pnpm run dev
   ```

## Additional Documentation

For more information about the project, please refer to the following resources:

- [README.md](../README.md) - main project documentation
- [Diagrams](diagrams/README_eng.md) - diagrams of the system architecture and functionality
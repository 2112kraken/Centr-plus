# RokoCDN - Documentation

Welcome to the documentation for the RokoCDN project - a CDN resource management system.

## Contents

### General Information
- [About the Project](README_eng.md)
- [Main Project README](../README.md)

### Diagrams
- [About Diagrams](diagrams/README_eng.md)
- [Architecture Diagram](diagrams/01-architecture.md)
- [ER Diagram](diagrams/02-entity-relationship.md)
- [Deployment Sequence Diagram](diagrams/03-sequence-deploy.md)
- [Deploy Job State Diagram](diagrams/04-state-deploy-job.md)
- [Data Flow Diagram](diagrams/05-data-flow.md)
- [Infrastructure Diagram](diagrams/06-infrastructure.md)
- [Use Case Diagram](diagrams/07-use-case.md)
- [Component Diagram](diagrams/08-component.md)

## Project Overview

RokoCDN is a full-stack web application for managing CDN resources. It provides a comprehensive solution for managing projects, servers, domains, DNS records, configurations, and other aspects of CDN.

### Key Features

- **Mirror Site Management**: creating new mirrors (site copies) on different servers, updating their configurations, monitoring status.
- **Proxy Management**: setting up and configuring proxy servers that redirect traffic to the main resource in real-time.
- **Redirector Management**: configuring redirector domains that automatically redirect users from one domain to another.
- **Domain Management**: binding domain names to mirrors/proxies, automatically creating DNS records through the Cloudflare API.
- **Automated Deployment**: integration with VPS providers and using Ansible scripts for automatic deployment of new mirrors, proxies, and redirectors on servers.
- **Monitoring and Reporting**: regular health-check verifications of mirrors and proxies availability, logging administrator actions and system events.

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

### Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- npm or pnpm (for local development)

## Getting Started

To get started with the project, please refer to the [README_eng.md](README_eng.md) for installation and running instructions.
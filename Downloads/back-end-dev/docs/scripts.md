# Scripts Documentation

## Table of Contents

- [Scripts Documentation](#scripts-documentation)
  - [Table of Contents](#table-of-contents)
  - [Build \& Start Scripts](#build--start-scripts)
    - [build.sh](#buildsh)
    - [start-service-in-docker.sh](#start-service-in-dockersh)
  - [Helm Scripts](#helm-scripts)
    - [heml/template.sh](#hemltemplatesh)
    - [heml/update.sh](#hemlupdatesh)
    - [heml/upgrage.sh](#hemlupgragesh)
  - [Kubernetes Scripts](#kubernetes-scripts)
    - [kube/triger-migration-job.sh](#kubetriger-migration-jobsh)
  - [Database Migration Scripts](#database-migration-scripts)
    - [migration/create-migration.sh](#migrationcreate-migrationsh)
    - [migration/generate-migration.sh](#migrationgenerate-migrationsh)
    - [migration/revert-migration.sh](#migrationrevert-migrationsh)
    - [migration/run-migration.sh](#migrationrun-migrationsh)

This document provides an overview of all utility scripts located in the `startup/scripts` directory.

## Build & Start Scripts

### build.sh

Builds a Docker image for a specified application using Docker BuildKit.

**Usage:**

```bash
./build.sh <app_name>
```

**Features:**

- Enables Docker BuildKit for improved build performance
- Uses build caching
- Takes application name as a parameter
- Creates a Docker image tagged with the application name

### start-service-in-docker.sh

Starts a service in Docker with debugging and watch mode enabled.

**Features:**

- Runs migrations before starting the service
- Enables debug mode on port 9229
- Enables watch mode for development

## Helm Scripts

### heml/template.sh

Generates Helm template for a specified application and environment.

**Usage:**

```bash
./template.sh <env> <app_name> <root>
```

**Features:**

- Generates Kubernetes manifests from Helm templates
- Uses environment-specific values
- Supports different chart roots

### heml/update.sh

Updates an existing Helm release.

**Usage:**

```bash
./update.sh <env> <app_name>
```

**Features:**

- Updates existing Helm releases
- Uses environment-specific values
- Applies to specified namespace

### heml/upgrage.sh

Upgrades or installs a Helm release.

**Usage:**

```bash
./upgrage.sh <env> <app_name>
```

**Features:**

- Upgrades existing release or installs if not present
- Uses environment-specific values
- Applies to specified namespace

## Kubernetes Scripts

### kube/triger-migration-job.sh

Triggers a database migration job in Kubernetes.

**Usage:**

```bash
./triger-migration-job.sh <env> <app_name>
```

**Features:**

- Deletes existing migration job if present
- Creates new migration job using Helm template
- Applies job to specified namespace

## Database Migration Scripts

### migration/create-migration.sh

Creates a new empty migration file.

**Usage:**

```bash
./create-migration.sh <migration-name> [app-name] [node-env]
```

**Features:**

- Creates TypeORM migration file
- Supports custom application name
- Default environment is "local"

### migration/generate-migration.sh

Generates a migration based on entity changes.

**Usage:**

```bash
./generate-migration.sh <migration-name> [app-name] [node-env]
```

**Features:**

- Automatically generates migration based on entity changes
- Uses TypeORM CLI
- Supports custom application and environment

### migration/revert-migration.sh

Reverts the last applied migration.

**Usage:**

```bash
./revert-migration.sh [app-name] [node-env]
```

**Features:**

- Reverts most recent migration
- Uses TypeORM CLI
- Supports custom application and environment

### migration/run-migration.sh

Runs pending migrations.

**Usage:**

```bash
./run-migration.sh [app-name] [node-env]
```

**Features:**

- Runs all pending migrations
- Uses TypeORM CLI
- Supports custom application and environment

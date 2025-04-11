# NestJS Modular Architecture Documentation

## Overview

This document describes a modernized approach to NestJS application architecture, emphasizing modularity and clear separation of concerns. The architecture is designed for a monorepo structure, allowing multiple services to share common code while maintaining clear boundaries.

## Traditional vs. Modular Approach

### Traditional Approach

```mermaid
graph TB
    classDef moduleNode fill:#f0f0f0,stroke:#333,stroke-width:2px

    A[Root] --> B[Controllers]
    A --> C[Services]
    A --> D[Repositories]

    B --> B1[Identity Controller]
    B --> B2[User Controller]

    C --> C1[JWT Service]
    C --> C2[Session Service]
    C --> C3[User Service]

    D --> D1[User Repository]
    D --> D2[Session Repository]

    %% Cyclic relations
    C1 <--> |Cyclic dependence| C2
    C2 <--> |Cyclic dependence| C3
    B1 --> C2
    B2 --> C1
```

### Modular Approach - Modules Structure

```mermaid
graph TB
    classDef moduleNode fill:#f0f0f0,stroke:#333,stroke-width:2px

    Root[Root] --> Modules

    %% Core Modules
    subgraph "Core Modules"
        direction TB
        JM[JWT Module]:::moduleNode
        SM[Security Module]:::moduleNode
        SEM[Session Module]:::moduleNode
        UM[User Module]:::moduleNode
        EM[Exceptions Module]:::moduleNode
    end

    %% JWT Module Structure
    JM --> JMR[JWT Resolver]
    JM --> JMS[JWT Service]
    JM --> JME[JWT Entities]

    %% Security Module Structure
    SM --> SMR[Security Resolver]
    SM --> SMS[Security Service]
    SM --> SME[Security Entities]

    %% Session Module Structure
    SEM --> SEMR[Session Resolver]
    SEM --> SEMS[Session Service]
    SEM --> SEME[Session Entities]

    %% User Module Structure
    UM --> UMR[User Resolver]
    UM --> UMS[User Service]
    UM --> UME[User Entities]
```

### Modular Approach - Actions Structure

```mermaid
graph TB
    classDef moduleNode fill:#f0f0f0,stroke:#333,stroke-width:2px
    classDef commandNode fill:#f9f,stroke:#333,stroke-width:2px

    Root[Root] --> Actions

    %% Commands
    subgraph "Actions & Commands"
        direction TB
        Actions --> CMD1[Login Command]:::commandNode
        Actions --> CMD2[Register Command]:::commandNode
    end

    %% Login Command Dependencies
    subgraph "Login Command Dependencies"
        CMD1 --> JMRef1[JWT Module]:::commandNode
        CMD1 --> SEMRef1[Session Module]:::commandNode
        CMD1 --> UMRef1[User Module]:::commandNode
        CMD1 --> EMRef1[Exceptions Module]:::commandNode
    end

    %% Register Command Dependencies
    subgraph "Register Command Dependencies"
        CMD2 --> SMRef1[Security Module]:::commandNode
        CMD2 --> UMRef2[User Module]:::commandNode
        CMD2 --> EMRef2[Exceptions Module]:::commandNode
    end
```

### Traditional Approach

In traditional NestJS applications, code is organized by technical types:

- `/controllers` - All controllers across the application
- `/services` - All services
- `/repositories` - All repositories

Drawbacks:

- Poor navigation in large applications
- Difficult to understand feature boundaries
- High coupling between different features
- Challenging to maintain as the application grows

### Modular Approach

Our architecture organizes code by business domains:

- Each module is self-contained
- Contains its own controllers, services, and repositories
- Clear feature boundaries
- Easier navigation and maintenance
- Better scalability

Benefits:

- Improved code organization
- Clear feature boundaries
- Easier to add new features
- Better code reusability
- Reduced coupling between features

## Monorepo Structure

### Structure Overview

```mermaid
graph TB
    subgraph "Monorepo Root"
        A[Root] --> B[apps]
        A --> C[common]
        A --> D[libs]
        A --> E[startup]
        A --> F[k8s]

        subgraph "Service Structure"
            B --> B1[identity]
            B1 --> MIG[migrations]
            B1 --> SRC[src]

            subgraph "Source Structure"
                SRC --> ACT[actions]
                SRC --> COM[common]
                SRC --> MOD[modules]

                subgraph "Actions"
                    ACT --> CMD1[register.command.ts]
                    ACT --> CMD2[login.command.ts]
                end

                subgraph "Modules"
                    MOD --> USR[user]

                    subgraph "User Module"
                        USR --> US1[user.resolver.ts]
                        USR --> US2[user.service.ts]
                        USR --> US3[user.module.ts]
                        USR --> ENT[entity]
                        USR --> DTO[dto]

                        ENT --> EN1[admin.entity.ts]
                        ENT --> EN2[player-info.entity.ts]
                        ENT --> EN3[player.entity.ts]

                        DTO --> DTO1[login.dto.ts]
                    end
                end
            end
        end

        C --> C1[dto]
        C --> C2[modules]

        D --> D1[Custom Libraries]

        E --> E1[Docker]
        E --> E2[Scripts]

        F --> F1[Manifests]
        F --> F2[Helm Charts]
    end

    style ACT fill:#f9f,stroke:#333,stroke-width:2px
    style MOD fill:#f0f0f0,stroke:#333,stroke-width:2px
    style USR fill:#e1e1e1,stroke:#333,stroke-width:2px
```

### Root Level

- `/apps` - All microservices
- `/common` - Shared code and modules
- `/libs` - Custom libraries
- `/startup` - Deployment and utility scripts
- `/k8s` - Kubernetes configurations

### Common Directory

- `/dto` - Shared DTOs
- `/modules` - Shared modules (logging, caching, etc.)

### Service Structure (in /apps)

Each service follows a consistent structure:

- `/migrations` - Database migrations
- `/src`
  - `/actions` - Business logic orchestration
  - `/common` - Service-specific shared code
  - `/modules` - Business domain modules

### Module Structure

Example for User module (`/apps/identity/modules/user`):

```
user/
├── user.resolver.ts
├── user.service.ts
├── user.module.ts
├── entity/
│   ├── admin.entity.ts
│   ├── player-info.entity.ts
│   └── player.entity.ts
└── dto/
    └── login.dto.ts
```

## Actions Pattern

### Architectural Overview with Actions

```mermaid
graph TB
    subgraph "Application Structure with Actions"
        A[Application Root] --> M[Modules]
        A --> AC[Actions]

        M --> M1[User Module]
        M --> M2[Identity Module]
        M --> M3[Other Modules...]

        M1 --> M1C[Controller]
        M1 --> M1S[Service]
        M1 --> M1R[Repository]

        AC --> C1[Commands]
        AC --> C2[Queries]

        C1 --> CMD1[RegisterCommand]
        C1 --> CMD2[LoginCommand]
        C2 --> Q1[GetUserQuery]

        CMD1 --> |uses| M1S
        CMD1 --> |uses| M2S
        CMD2 --> |uses| M1S
        Q1 --> |uses| M1S

        M2 --> M2S[Service]
    end
```

Actions are introduced to handle complex business operations that span multiple modules while avoiding circular dependencies.

### Purpose

- Orchestrate complex operations
- Prevent circular dependencies
- Separate complex business logic from modules
- Maintain single responsibility principle

### Implementation

Actions use CQRS pattern with Commands and Queries:

Example Commands:

1. `register.command.ts`
2. `login.command.ts`

These commands can use multiple services:

- TokenService
- UserService
- PasswordService
- SessionService
- ExceptionService

Benefits:

- Clear separation of concerns
- Avoid service pollution with complex logic
- Better testability
- Improved maintainability

## Best Practices

1. Module Independence

   - Each module should be self-contained
   - Minimal dependencies between modules
   - Clear interface definitions

2. Action Pattern Usage

   - Use actions for complex operations
   - Keep module services focused on their domain
   - Implement CQRS pattern for better separation

3. Shared Code Management

   - Use common directory for truly shared code
   - Avoid circular dependencies
   - Keep shared code minimal and generic

4. Testing
   - Each module can be tested independently
   - Actions provide clear boundaries for integration tests
   - Easier to mock dependencies

# RokoCDN Documentation Structure

This file contains a description of the documentation structure for the RokoCDN project.

## General Structure

```
docs/
├── README.md                  # General documentation description in Ukrainian
├── README_eng.md              # General documentation description in English
├── index.md                   # Documentation index file in Ukrainian
├── index_eng.md               # Documentation index file in English
├── documentation_structure.md # This file - documentation structure description in Ukrainian
├── documentation_structure_eng.md # This file - documentation structure description in English
└── diagrams/                  # Directory with diagrams
    ├── README.md              # Diagrams description in Ukrainian
    ├── README_eng.md          # Diagrams description in English
    ├── 01-architecture.md     # Architecture diagram
    ├── 02-entity-relationship.md # ER diagram
    ├── 03-sequence-deploy.md  # Deployment sequence diagram
    ├── 04-state-deploy-job.md # Deploy job state diagram
    ├── 05-data-flow.md        # Data flow diagram
    ├── 06-infrastructure.md   # Infrastructure diagram
    ├── 07-use-case.md         # Use case diagram
    └── 08-component.md        # Component diagram
```

## File Descriptions

### General Files

- **README.md** - general documentation description in Ukrainian. Contains information about the project, its architecture, main features, and installation and running instructions.
- **README_eng.md** - same as README.md, but in English.
- **index.md** - documentation index file in Ukrainian. Contains links to all documentation sections and a brief project overview.
- **index_eng.md** - same as index.md, but in English.
- **documentation_structure.md** - this file in Ukrainian, which contains a description of the documentation structure.
- **documentation_structure_eng.md** - this file, which contains a description of the documentation structure in English.

### Diagrams

- **diagrams/README.md** - diagrams description in Ukrainian. Contains information about diagram types, their purpose, and usage instructions.
- **diagrams/README_eng.md** - same as diagrams/README.md, but in English.
- **diagrams/01-architecture.md** - architecture diagram, which shows the overall system architecture and interaction between its components.
- **diagrams/02-entity-relationship.md** - ER diagram, which shows the system data model and relationships between entities.
- **diagrams/03-sequence-deploy.md** - sequence diagram, which shows the process of creating and deploying a new domain.
- **diagrams/04-state-deploy-job.md** - state diagram, which shows the lifecycle of a deployment job.
- **diagrams/05-data-flow.md** - data flow diagram, which shows data flows between system components.
- **diagrams/06-infrastructure.md** - infrastructure diagram, which shows physical components of the system and their interaction.
- **diagrams/07-use-case.md** - use case diagram, which shows the main system functions from the user's perspective.
- **diagrams/08-component.md** - component diagram, which shows the structure of modules and components of the system.

## Using the Documentation

The documentation is intended for developers, administrators, and other stakeholders who work with the RokoCDN project. It contains information about the architecture, functionality, and usage of the system.

### For Developers

Developers can use the documentation to:
- Understand the system architecture
- Study the data model
- Understand the interaction between components
- Plan new features and changes

### For Administrators

Administrators can use the documentation to:
- Install and configure the system
- Understand deployment processes
- Monitor and maintain the system

### For Other Stakeholders

Other stakeholders can use the documentation to:
- Understand system capabilities
- Plan system usage
- Evaluate system compliance with requirements

## Updating the Documentation

When making changes to the system, it is also important to update the corresponding documentation to reflect the current state of the system. This will help keep the documentation up to date and simplify understanding of the system for all project participants.
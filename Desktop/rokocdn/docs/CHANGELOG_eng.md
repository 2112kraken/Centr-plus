# Changelog

This file contains the history of changes in the RokoCDN project.

## [Unreleased]

### Added
- Created project documentation with Mermaid diagrams
- Added architecture, data model, sequence, state, data flow, infrastructure, use case, and component diagrams
- Added documentation in Ukrainian and English

## [1.0.0] - 2025-04-14

### Added
- Created `sky_net_doc` branch for project documentation
- Created documentation structure:
  - `docs/README.md` - general documentation description in Ukrainian
  - `docs/README_eng.md` - general documentation description in English
  - `docs/index.md` - documentation index file in Ukrainian
  - `docs/index_eng.md` - documentation index file in English
  - `docs/documentation_structure.md` - documentation structure description in Ukrainian
  - `docs/documentation_structure_eng.md` - documentation structure description in English
  - `docs/CHANGELOG.md` - changelog in Ukrainian
  - `docs/CHANGELOG_eng.md` - changelog in English
- Created Mermaid diagrams:
  - `docs/diagrams/README.md` - diagrams description in Ukrainian
  - `docs/diagrams/README_eng.md` - diagrams description in English
  - `docs/diagrams/01-architecture.md` - architecture diagram
  - `docs/diagrams/02-entity-relationship.md` - ER diagram
  - `docs/diagrams/03-sequence-deploy.md` - deployment sequence diagram
  - `docs/diagrams/04-state-deploy-job.md` - deploy job state diagram
  - `docs/diagrams/05-data-flow.md` - data flow diagram
  - `docs/diagrams/06-infrastructure.md` - infrastructure diagram
  - `docs/diagrams/07-use-case.md` - use case diagram
  - `docs/diagrams/08-component.md` - component diagram

## Git Commit Message Format

The following git commit message format is used for this project:

```
<type>(<scope>): <short description>

<detailed description>

<issue references>
```

### Types

- **feat**: a new feature
- **fix**: a bug fix
- **docs**: documentation changes
- **style**: changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: code changes that neither fix a bug nor add a feature
- **perf**: code changes that improve performance
- **test**: adding missing tests or correcting existing tests
- **chore**: changes to the build process or auxiliary tools

### Examples

```
feat(auth): add JWT authentication

Added JWT authentication to protect the API. Implemented:
- JWT token generation
- Token verification
- Middleware for route protection

Closes #123
```

```
fix(domains): fix error when creating DNS record

Fixed an error that occurred when creating a DNS record with an empty TTL value.

Fixes #456
```

## Git Commit for Current Changes

```
docs(diagrams): add Mermaid diagrams for the project

Added a set of Mermaid diagrams for RokoCDN project documentation:
- Architecture diagram
- ER diagram
- Deployment sequence diagram
- Deploy job state diagram
- Data flow diagram
- Infrastructure diagram
- Use case diagram
- Component diagram

Added documentation in Ukrainian and English.

Closes #789
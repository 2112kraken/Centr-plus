# Testing

## Setup

- Environment: See [Local Development](./local-development.md)
- GraphQL: See [Microservices Communication](./microservices-communication.md)

## Commands

```bash
# E2E Tests
pnpm test:e2e              # Run all
pnpm test:e2e identity/login   # Run specific

# Performance Tests
pnpm test:perf            # Run all
pnpm test:perf --test=identity.registration  # Run specific

# SDK Generation
pnpm codegen              # Generate GraphQL SDK
```

## Core Principles

1. **Test Independence**

   - No dependencies between tests
   - Self-contained test data
   - Clean up after tests

2. **API-First Testing**

   - Use only public APIs (GraphQL/RPC)
   - No internal module imports
   - Client perspective testing

3. **Data Management**

   - Use test helpers
   - No hardcoded data
   - Clean up test data

4. **Error Handling**

   - Test success and error cases
   - Verify error responses
   - Proper error handling

5. **Performance Testing**
   - Independent iterations
   - Minimal setup/teardown
   - Focused operations
   - Efficient data generation

## Organization

- Separate E2E and performance tests
- Group by feature/service
- Common utilities in shared directory
- Consistent naming patterns

## Best Practices

1. Use public APIs only
2. Keep tests independent
3. Use test helpers
4. Clean up test data
5. Document complex scenarios
6. Consider performance impact

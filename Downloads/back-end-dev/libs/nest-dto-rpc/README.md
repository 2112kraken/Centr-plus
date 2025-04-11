# nest-dto-rpc

A lightweight TypeScript library for NestJS RPC with DTO-based message patterns and MessagePack serialization.

## Features

- DTO-based message pattern generation
- MessagePack serialization for efficient data transfer
- Custom pattern overrides when needed
- Easy integration with existing NestJS microservices
- Zero additional dependencies (only peer dependencies on NestJS packages)

## Installation

```bash
npm install nest-dto-rpc
```

## Usage

### 1. Define your DTO

```typescript
// transaction.dto.ts
export class ApplyTransactionDto {
  constructor(
    public readonly userId: string,
    public readonly amount: number,
  ) {}
}
```

### 2. Server-side Setup

```typescript
// transaction.controller.ts
import { Controller } from '@nestjs/common';
import { DtoMessagePattern } from 'nest-dto-rpc';
import { ApplyTransactionDto } from './transaction.dto';

@Controller()
export class TransactionController {
  @DtoMessagePattern('transaction-service')
  async applyTransaction(dto: ApplyTransactionDto) {
    // dto is automatically instantiated from the incoming message
    console.log(`Applying transaction for user ${dto.userId}: ${dto.amount}`);
    return { success: true };
  }
}

// Optional: Use custom pattern for specific DTO
@RemoteProcedureDto()
export class CustomTransactionDto {
  // ...
}
```

### 3. Client-side Setup

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NestDtoRpcModule, MsgPackSerializer, MsgPackDeserializer } from 'nest-dto-rpc';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TRANSACTION_SERVICE',
        transport: Transport.TCP,
        options: {
          serializer: new MsgPackSerializer(),
          deserializer: new MsgPackDeserializer(),
        },
      },
    ]),
    NestDtoRpcModule.register({
      client: ClientProxy, // Inject your configured ClientProxy
      serviceName: 'transaction-service',
    }),
  ],
})
export class AppModule {}
```

### 4. Using the Client

```typescript
// transaction.service.ts
import { Injectable } from '@nestjs/common';
import { DtoRpcClient } from 'nest-dto-rpc';
import { ApplyTransactionDto } from './transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private readonly rpcClient: DtoRpcClient) {}

  async applyTransaction(userId: string, amount: number) {
    const dto = new ApplyTransactionDto(userId, amount);
    return this.rpcClient.execute(dto);
  }
}
```

## Advanced Usage

### Async Module Registration

```typescript
// app.module.ts
import { NestDtoRpcModule } from 'nest-dto-rpc';

@Module({
  imports: [
    NestDtoRpcModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        client: configService.get('rpcClient'),
        serviceName: configService.get('serviceName'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

### Event Emission (No Response)

```typescript
// Using emit() when you don't need a response
await rpcClient.emit(new TransactionNotificationDto(userId));
```

## API Reference

### Decorators

- `@DtoMessagePattern(serviceName: string)`: Creates a message pattern handler using the DTO class name
- `@RemoteProcedureDto(pattern: string)`: Explicitly sets a message pattern for a DTO

### Classes

- `DtoRpcClient`: Main client for sending RPC messages

  - `execute<T, R>(dto: T): Promise<R>`: Send a message and wait for response
  - `emit<T>(dto: T): void`: Send a message without waiting for response

- `MsgPackSerializer`: MessagePack serializer for efficient data transfer
- `MsgPackDeserializer`: MessagePack deserializer for incoming messages

### Modules

- `NestDtoRpcModule`:
  - `register(options: DtoRpcModuleOptions)`: Static configuration
  - `registerAsync(options: AsyncModuleOptions)`: Dynamic configuration

## License

MIT

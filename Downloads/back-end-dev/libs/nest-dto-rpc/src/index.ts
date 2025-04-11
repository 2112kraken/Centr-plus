// Export decorators and utilities
export {
  MessagePatternDto,
  RemoteProcedureDto,
  getMessagePatternFromDto,
  MESSAGE_PATTERN_METADATA,
  EVENT_PATTERN_METADATA,
  getEventPatternFromDto,
  EventDto,
} from './decorators';

// Export client and module
export { DtoRpcClient } from './dto-rpc.client';
export { NestDtoRpcModule, DtoRpcModuleOptions } from './nest-dto-rpc.module';

// Re-export necessary types from @nestjs/microservices
export type { ClientProxy } from '@nestjs/microservices';

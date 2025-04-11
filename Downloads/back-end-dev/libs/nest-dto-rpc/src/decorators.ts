import { Type } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

export const MESSAGE_PATTERN_METADATA = 'dto_rpc:message_pattern';
export const EVENT_PATTERN_METADATA = 'dto_event:message_pattern';

/**
 * Decorator to set a message pattern for a DTO.
 * If no pattern is provided, the class name is used as the default pattern.
 * @param pattern The pattern to use for this DTO (optional)
 */
export function RemoteProcedureDto(pattern?: string): ClassDecorator {
  return (target: Record<string, any>) => {
    const finalPattern = pattern ?? target.name;
    Reflect.defineMetadata(MESSAGE_PATTERN_METADATA, { cmd: finalPattern }, target);
  };
}

/**
 * Get the message pattern associated with a DTO class
 * @param dto The DTO class
 */
export function getMessagePatternFromDto(dto: Record<string, any>): {
  cmd: string;
} {
  const metadata = Reflect.getMetadata(MESSAGE_PATTERN_METADATA, dto);
  if (!metadata) {
    throw new Error(
      `Class ${dto.constructor.name} must be decorated with @RemoteProcedureDto(pattern: string) to define a message pattern.`,
    );
  }
  return metadata;
}

/**
 * Custom decorator for MessagePattern based on DTO
 * @param dto The DTO class
 */
export function MessagePatternDto(dto: Type<any>): MethodDecorator {
  const metadata = getMessagePatternFromDto(dto);
  return (target, propertyKey, descriptor) => {
    MessagePattern(metadata)(target, propertyKey, descriptor);
  };
}

/**
 * Decorator to set a message pattern for a DTO.
 * If no pattern is provided, the class name is used as the default pattern.
 * @param pattern The pattern to use for this DTO (optional)
 */
export function EventDto(pattern?: string): ClassDecorator {
  return (target: Record<string, any>) => {
    const finalPattern = pattern ?? target.name;
    Reflect.defineMetadata(EVENT_PATTERN_METADATA, finalPattern, target);
  };
}

/**
 * Get the event pattern associated with a DTO class
 * @param dto The DTO class
 */
export function getEventPatternFromDto(dto: Record<string, any>) {
  const metadata = Reflect.getMetadata(EVENT_PATTERN_METADATA, dto);
  if (!metadata) {
    throw new Error(
      `Class ${dto.name || dto.constructor.name} must be decorated with @EventDto(pattern: string) to define a message pattern.`,
    );
  }
  return metadata;
}

/**
 * Custom decorator for MessagePattern based on DTO
 * @param dto The DTO class
 */
export function EventPatternDto(dto: Type<any>): MethodDecorator {
  const metadata = getEventPatternFromDto(dto);
  return (target, propertyKey, descriptor) => {
    EventPattern(metadata)(target, propertyKey, descriptor);
  };
}

import { FastifyRequest } from 'fastify';

import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

import { TtLogger } from '@app/logger';

import { PermissionName } from '@common/enum/permission-name.enum';
import { PERMISSIONS_REQUIRED } from '@common/modules/security/jwt/decorators/permissions.decorator';
import {
  ACCESS_TOKEN_REQUIRED,
  REFRESH_TOKEN_REQUIRED,
} from '@common/modules/security/jwt/decorators/user-id.decorator';
import { TokenType } from '@common/modules/security/jwt/enum/token-type.enum';
import { TokenService, JwtPayload } from '@common/modules/security/jwt/token.service';

interface AuthenticatedRequest extends FastifyRequest {
  jwtPayload: JwtPayload;
}

interface GqlContext {
  req: AuthenticatedRequest;
}

type MetadataKey = typeof ACCESS_TOKEN_REQUIRED | typeof REFRESH_TOKEN_REQUIRED | typeof PERMISSIONS_REQUIRED;

type TokenMetadata = {
  isAccessRequired: boolean;
  isRefreshRequired: boolean;
  permissions: PermissionName[];
};

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly reflector: Reflector,
    private readonly logger: TtLogger,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const metadata = this.getMetadata(context);

    if (!metadata.isAccessRequired && !metadata.isRefreshRequired) {
      return true;
    }

    const request = this.getRequest(context);
    const token = this.getTokenFromRequest(request);

    if (!token) {
      this.logger.warn({
        msg: 'Authentication failed: No token provided',
        data: {
          path: request.url,
          headers: request.headers,
        },
      });
      throw new UnauthorizedException('Please provide authentication token');
    }

    const payload = await this.verifyToken(token);

    this.validateTokenType(payload, metadata);
    this.validatePermissions(payload, metadata.permissions);

    request.jwtPayload = payload;
    return true;
  }

  private validateTokenType(payload: JwtPayload, metadata: TokenMetadata) {
    if (!metadata.isAccessRequired && !metadata.isRefreshRequired) {
      return;
    }

    const isInvalidAccessToken = metadata.isAccessRequired && payload.type !== TokenType.ACCESS;
    const isInvalidRefreshToken = metadata.isRefreshRequired && payload.type !== TokenType.REFRESH;

    if (!isInvalidAccessToken && !isInvalidRefreshToken) {
      return;
    }

    const requiredType = metadata.isAccessRequired ? 'ACCESS' : 'REFRESH';

    this.logger.warn({
      msg: 'Authentication failed: Wrong token type',
      data: {
        required: requiredType,
        provided: payload.type,
        userId: payload.sub,
      },
    });

    throw new UnauthorizedException(`${requiredType} token required for this operation`);
  }

  private validatePermissions(payload: JwtPayload, requiredPermissions: PermissionName[]): void {
    if (!requiredPermissions?.length) {
      return;
    }

    const missingPermissions = requiredPermissions.filter((p) => !payload.permissions.includes(p));

    if (!missingPermissions.length) {
      return;
    }

    this.logger.warn({
      msg: 'Authentication failed: Missing permissions',
      data: {
        userId: payload.sub,
        missingPermissions,
        userPermissions: payload.permissions,
      },
    });

    throw new UnauthorizedException(`Missing required permissions: ${missingPermissions.join(', ')}`);
  }

  private getMetadata(context: ExecutionContext): TokenMetadata {
    const getMetadataValue = (key: MetadataKey) =>
      this.reflector.getAllAndOverride(key, [context.getHandler(), context.getClass()]);

    return {
      isAccessRequired: getMetadataValue(ACCESS_TOKEN_REQUIRED),
      isRefreshRequired: getMetadataValue(REFRESH_TOKEN_REQUIRED),
      permissions: getMetadataValue(PERMISSIONS_REQUIRED) || [],
    };
  }

  private getRequest(context: ExecutionContext): AuthenticatedRequest {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext<GqlContext>().req;
  }

  private getTokenFromRequest(request: AuthenticatedRequest): string | undefined {
    const [type, token] = (request.headers.authorization?.split(' ') ?? []).map((v) => v.trim());
    return type === 'Bearer' ? token : undefined;
  }

  private async verifyToken(token: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.tokenService.getSecretForToken(token),
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');

      this.logger.error({
        err: error,
        msg: 'Token verification failed',
        data: {
          token,
          error: error.message,
          name: error.name,
        },
      });

      throw new UnauthorizedException('Invalid or expired token. Please login again.');
    }
  }
}

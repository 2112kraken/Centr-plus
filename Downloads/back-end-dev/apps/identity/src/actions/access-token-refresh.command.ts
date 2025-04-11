import { plainToInstance } from 'class-transformer';

import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { TtLogger } from '@app/logger';

import { TokenType } from '@common/modules/security/jwt/enum/token-type.enum';
import { TokenService } from '@common/modules/security/jwt/token.service';

import { RbacService } from '@identity/modules/rbac/rbac.service';
import { SessionService } from '@identity/modules/session/session.service';

export class AccessTokenRefreshCommand {
  refreshToken: string;

  constructor(data: AccessTokenRefreshCommand) {
    if (data) {
      Object.assign(this, plainToInstance(AccessTokenRefreshCommand, data));
    }
  }
}

@CommandHandler(AccessTokenRefreshCommand)
export class AccessTokenRefreshCommandHandler implements ICommandHandler<AccessTokenRefreshCommand> {
  constructor(
    private readonly tokenService: TokenService,
    private readonly sessionService: SessionService,
    private readonly rbacService: RbacService,
    private readonly logger: TtLogger,
  ) {}

  async execute(command: AccessTokenRefreshCommand) {
    const [tokenType, token] = command.refreshToken?.split(' ');

    if (tokenType !== 'Bearer') {
      this.logger.warn({
        msg: 'JWT token shoud start with "Bearer"',
        data: { command, tokenType },
      });
      throw new UnauthorizedException();
    }

    const jwtPayload = await this.tokenService.verifyRefreshToken(token);

    if (!jwtPayload) {
      throw new UnauthorizedException();
    }

    const { sessionId, scope, type } = jwtPayload;
    if (type !== TokenType.REFRESH) {
      throw new BadRequestException();
    }

    const [permissions, { session, user }] = await Promise.all([
      await this.rbacService.getUserPermissions(scope, jwtPayload.sub),
      await this.sessionService.findActiveSession(sessionId, scope),
    ]);

    if (!session || !user) {
      throw new BadRequestException('Session expired');
    }

    return {
      user,
      refreshToken: this.tokenService.generateRefreshToken(scope, session),
      accessToken: this.tokenService.generateAccessToken(scope, session, Array.from(permissions.values())),
    };
  }
}

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtConfig } from '@common/modules/config/configs';
import { TokenType } from '@common/modules/security/jwt/enum/token-type.enum';
import { UserScope } from '@common/modules/security/jwt/enum/user-scope.enum';

import { PermissionName } from '@identity/modules/rbac/entity/permission.entity';
import { Session } from '@identity/modules/session/session.entity';

export interface JwtPayload {
  sessionId: string;
  type: TokenType;
  scope: UserScope;
  sub: string;
  channels: string[];
  permissions: PermissionName[];
}

export type JwtRefreshPayload = Pick<JwtPayload, 'sub' | 'scope' | 'type' | 'sessionId'>;

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly jwtConfig: JwtConfig,
  ) {}

  getExpiresAt(type: TokenType) {
    const expiresIn = this.jwtConfig[type.toLowerCase() as keyof JwtConfig].expiresIn;

    if (!expiresIn) {
      throw new Error(`Token type "${type}" is not configured properly.`);
    }

    return new Date(Date.now() + expiresIn * 1000);
  }

  generateAccessToken(scope: UserScope, session: Session, permissions: PermissionName[]) {
    const sub = session.playerId || session.adminId;

    if (!sub) {
      throw new Error("session don't playerId or adminId");
    }

    const payload: JwtPayload = {
      sub,
      scope,
      permissions,
      type: TokenType.ACCESS,
      sessionId: session.sessionId,
      channels: [`${scope}#${sub}`.toLowerCase()],
    };

    return this.jwtService.sign(payload, this.jwtConfig.access);
  }

  generateRefreshToken(scope: UserScope, session: Session) {
    const sub = session.playerId || session.adminId;

    if (!sub) {
      throw new Error("session don't playerId or adminId");
    }

    const payload: JwtRefreshPayload = {
      sub,
      scope,
      type: TokenType.REFRESH,
      sessionId: session.sessionId,
    };

    return this.jwtService.sign(payload, this.jwtConfig.refresh);
  }

  getSecretForToken(token: string): string {
    const payload = this.jwtService.decode<JwtPayload>(token);

    switch (payload.type) {
      case TokenType.ACCESS:
        return this.jwtConfig.access.secret;

      case TokenType.REFRESH:
        return this.jwtConfig.refresh.secret;

      default:
        throw new Error(`Token type "${payload.type}" is unknown. Check enum TokenType`);
    }
  }

  async verifyRefreshToken(token: string) {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.jwtConfig.refresh.secret,
      });
    } catch {
      return null;
    }
  }
}

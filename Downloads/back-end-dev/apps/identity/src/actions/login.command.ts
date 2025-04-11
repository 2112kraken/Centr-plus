import { plainToInstance } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { TokenType } from '@common/modules/security/jwt/enum/token-type.enum';
import { UserScope } from '@common/modules/security/jwt/enum/user-scope.enum';
import { TokenService } from '@common/modules/security/jwt/token.service';
import { PasswordService } from '@common/modules/security/password/password.service';

import { ErrorCode, ErrorService } from '@identity/common/exceptions/error.service';
import { LoginDto, RequestExtraDto } from '@identity/modules/authentication/dto/login.dto';
import { RbacService } from '@identity/modules/rbac/rbac.service';
import { SessionService } from '@identity/modules/session/session.service';
import { UserService } from '@identity/modules/user/user.service';

export class LoginCommand extends LoginDto {
  scope: UserScope;
  extra?: Partial<RequestExtraDto>;

  constructor(data: LoginCommand) {
    super();

    if (data) {
      Object.assign(this, plainToInstance(LoginCommand, data));
    }
  }
}

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly sessionService: SessionService,
    private readonly rbacService: RbacService,
    private readonly errorService: ErrorService,
  ) {}

  @Transactional()
  async execute(command: LoginCommand) {
    const { extra, scope, contact, password } = command;

    const user = await this.userService.getUserByScope(scope, contact, this.passwordService.hashPassword(password));

    if (!user) {
      throw this.errorService.throw(ErrorCode.WRONG_CREDENTIALS);
    }

    const [permissions, session] = await Promise.all([
      await this.rbacService.getUserPermissions(scope, user.id),
      await this.sessionService.createSession(scope, user, {
        ...extra,
        expiresAt: this.tokenService.getExpiresAt(TokenType.ACCESS),
      }),
    ]);

    return {
      user,
      refreshToken: this.tokenService.generateRefreshToken(scope, session),
      accessToken: this.tokenService.generateAccessToken(scope, session, Array.from(permissions.values())),
    };
  }
}

import { plainToInstance } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PlayerPasswordChangedEvent } from '@common/modules/event-bus/events/player.events';
import { ProducerService } from '@common/modules/event-bus/producer.service';
import { TokenType } from '@common/modules/security/jwt/enum/token-type.enum';
import { UserScope } from '@common/modules/security/jwt/enum/user-scope.enum';
import { TokenService } from '@common/modules/security/jwt/token.service';
import { PasswordService } from '@common/modules/security/password/password.service';
import { TempTokenService, TempTokenType } from '@common/modules/security/temp-token/temp-token.service';

import { ErrorCode, ErrorService } from '@identity/common/exceptions/error.service';
import { RequestExtraDto } from '@identity/modules/authentication/dto/login.dto';
import { PasswordFinishResetDto } from '@identity/modules/authentication/dto/reset-password.dto';
import { RbacService } from '@identity/modules/rbac/rbac.service';
import { SessionService } from '@identity/modules/session/session.service';
import { Player } from '@identity/modules/user/entities/player.entity';
import { UserService } from '@identity/modules/user/user.service';

export class PasswordFinishResetCommand extends PasswordFinishResetDto {
  scope: UserScope;
  extra?: Partial<RequestExtraDto>;

  constructor(data: PasswordFinishResetCommand) {
    super();

    if (data) {
      Object.assign(this, plainToInstance(PasswordFinishResetCommand, data));
    }
  }
}

@CommandHandler(PasswordFinishResetCommand)
export class PasswordFinishResetCommandHandler implements ICommandHandler<PasswordFinishResetCommand> {
  constructor(
    private readonly tempTokenService: TempTokenService,
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly sessionService: SessionService,
    private readonly tokenService: TokenService,
    private readonly producerService: ProducerService,
    private readonly rbacService: RbacService,
    private readonly errorService: ErrorService,
  ) {}

  @Transactional()
  async execute(command: PasswordFinishResetCommand) {
    const { scope, newPassword, extra, token, contact } = command;

    const isTokenValid = await this.tempTokenService.verifyTempToken(token, {
      type: TempTokenType.RESET_PASSWORD,
      contact: contact.value,
    });

    if (!isTokenValid) {
      this.errorService.throw(ErrorCode.INVALID_TOKEN, { field: 'token' });
    }

    const user = await this.userService.setUserPassword(scope, contact, this.passwordService.hashPassword(newPassword));

    if (user instanceof Player) {
      await this.producerService.publish(new PlayerPasswordChangedEvent({ contact: user.mainContact }));
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

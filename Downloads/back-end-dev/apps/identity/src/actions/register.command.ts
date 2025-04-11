import { plainToInstance } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { TtLogger } from '@app/logger';

import { ContactSource } from '@common/enum/contact-source.enum';
import { TokenType } from '@common/modules/security/jwt/enum/token-type.enum';
import { UserScope } from '@common/modules/security/jwt/enum/user-scope.enum';
import { TokenService } from '@common/modules/security/jwt/token.service';
import { PasswordService } from '@common/modules/security/password/password.service';

import { ErrorCode, ErrorService } from '@identity/common/exceptions/error.service';
import { RequestExtraDto } from '@identity/modules/authentication/dto/login.dto';
import { RegisterDto } from '@identity/modules/authentication/dto/register.dto';
import { RbacService } from '@identity/modules/rbac/rbac.service';
import { SessionService } from '@identity/modules/session/session.service';
import { UserService } from '@identity/modules/user/user.service';

export class RegisterCommand extends RegisterDto {
  scope: UserScope;
  extra?: Partial<RequestExtraDto>;

  constructor(data: RegisterCommand) {
    super();

    if (data) {
      Object.assign(this, plainToInstance(RegisterCommand, data));
    }
  }
}

@CommandHandler(RegisterCommand)
export class RegisterCommandHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly sessionService: SessionService,
    private readonly rbacService: RbacService,
    private readonly errorService: ErrorService,
    private readonly logger: TtLogger,
  ) {}

  async execute(command: RegisterCommand) {
    try {
      return await this.register(command);
    } catch (err) {
      if (ErrorService.isDuplicateKeyError(err)) {
        this.errorService.throw(ErrorCode.DUPLICATE_CONTACT);
      }

      throw err;
    }
  }

  @Transactional()
  private async register(command: RegisterCommand) {
    const { extra, scope } = command;
    const user = await this.createUserByContext(scope, command);

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

  private async createUserByContext(scope: UserScope, data: RegisterDto) {
    const { password, username, contact, ...userData } = data;
    const passwordHash = this.passwordService.hashPassword(password);

    switch (scope) {
      case UserScope.ADMIN:
        return this.userService.adminRepository.save(
          this.userService.adminRepository.create({
            ...userData,
            passwordHash,
            contacts: [
              this.userService.adminContactRepository.create({
                ...contact,
                source: ContactSource.REGISTRATION,
                isMain: true,
              }),
            ],
          }),
        );

      case UserScope.PLAYER:
        return this.userService.playerRepository.save(
          this.userService.playerRepository.create({
            ...userData,
            username,
            passwordHash,
            normalizedUsername: this.userService.normalizeUsername(username),
            contacts: [
              this.userService.playerContactRepository.create({
                ...contact,
                source: ContactSource.REGISTRATION,
                isMain: true,
              }),
            ],
          }),
        );

      default:
        this.logger.error({
          err: new Error('Wrong user scope.'),
          data: { expected: Object.values(UserScope) },
          msg: 'Wrong user scope.',
        });

        throw new Error(`Wrong scope "${scope}". Context should includes in enum UserContext.`);
    }
  }
}

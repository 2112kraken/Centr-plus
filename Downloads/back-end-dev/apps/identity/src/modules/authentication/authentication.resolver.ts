import { FastifyRequest } from 'fastify';

import { CommandBus } from '@nestjs/cqrs';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import {
  AccessTokenRequired,
  RefreshTokenRequired,
  UserId,
} from '@common/modules/security/jwt/decorators/user-id.decorator';
import { UserScope } from '@common/modules/security/jwt/enum/user-scope.enum';
import { TempTokenResponseDto } from '@common/modules/security/temp-token/dto/temp-token.dto';
import { getHeaderData } from '@common/util';

import { AccessTokenRefreshCommand } from '@identity/actions/access-token-refresh.command';
import { ContactBeginConfirmationCommand } from '@identity/actions/contact-begin-confirmation.command';
import { ContactFinishConfirmationCommand } from '@identity/actions/contact-finish-confirmation.command';
import { LoginCommand } from '@identity/actions/login.command';
import { PasswordBeginResetCommand } from '@identity/actions/password-begin-reset.command';
import { PasswordFinishResetCommand } from '@identity/actions/password-confirm-reset.command';
import { RegisterCommand } from '@identity/actions/register.command';
import {
  ContactBeginConfirmationDto,
  ContactFinishConfirmationDto,
} from '@identity/modules/authentication/dto/contact-confirm.dto';
import { LoginDto, LoginResponseDto } from '@identity/modules/authentication/dto/login.dto';
import { RegisterDto } from '@identity/modules/authentication/dto/register.dto';
import { PasswordBeginResetDto, PasswordFinishResetDto } from '@identity/modules/authentication/dto/reset-password.dto';
import { PlayerContact } from '@identity/modules/user/entities/player-contact.entity';

@Resolver()
export class AuthenticationResolver {
  constructor(private readonly commandBus: CommandBus) {}

  @Mutation(() => LoginResponseDto)
  async login(@Args('dto') dto: LoginDto, @Context('req') req: FastifyRequest): Promise<LoginResponseDto> {
    const extra = getHeaderData(req);

    return this.commandBus.execute(
      new LoginCommand({
        ...dto,
        scope: UserScope.PLAYER,
        extra,
      }),
    );
  }

  @Mutation(() => LoginResponseDto)
  async register(@Args('dto') dto: RegisterDto, @Context('req') req: FastifyRequest): Promise<LoginResponseDto> {
    const extra = getHeaderData(req);

    const res = await this.commandBus.execute(
      new RegisterCommand({
        ...dto,
        extra,
        scope: UserScope.PLAYER,
      }),
    );

    return res;
  }

  @Mutation(() => LoginResponseDto)
  @RefreshTokenRequired()
  async refreshAccessToken(@Context('req') req: FastifyRequest): Promise<LoginResponseDto> {
    return this.commandBus.execute(
      new AccessTokenRefreshCommand({
        refreshToken: req.headers.authorization!,
      }),
    );
  }

  @Mutation(() => TempTokenResponseDto)
  async beginResetPassword(
    @Args('dto') dto: PasswordBeginResetDto,
    @Context('req') req: FastifyRequest,
  ): Promise<void> {
    const extra = getHeaderData(req);

    return this.commandBus.execute(
      new PasswordBeginResetCommand({
        ...dto,
        extra,
        scope: UserScope.PLAYER,
      }),
    );
  }

  @Mutation(() => LoginResponseDto)
  async finishResetPassword(
    @Args('dto') dto: PasswordFinishResetDto,
    @Context('req') req: FastifyRequest,
  ): Promise<void> {
    const extra = getHeaderData(req);

    return this.commandBus.execute(
      new PasswordFinishResetCommand({
        ...dto,
        extra,
        scope: UserScope.PLAYER,
      }),
    );
  }

  @AccessTokenRequired()
  @Mutation(() => TempTokenResponseDto)
  async beginContactConfirmation(
    @Args('dto') dto: ContactBeginConfirmationDto,
    @Context('req') req: FastifyRequest,
    @UserId() playerId: string,
  ): Promise<void> {
    const extra = getHeaderData(req);

    return this.commandBus.execute(
      new ContactBeginConfirmationCommand({
        ...dto,
        extra,
        playerId,
      }),
    );
  }

  @AccessTokenRequired()
  @Mutation(() => PlayerContact)
  async finishContactConfirmation(
    @Args('dto', { type: () => ContactFinishConfirmationDto })
    dto: ContactFinishConfirmationDto,
    @Context('req') req: FastifyRequest,
    @UserId() playerId: string,
  ): Promise<void> {
    const extra = getHeaderData(req);

    return this.commandBus.execute(
      new ContactFinishConfirmationCommand({
        ...dto,
        extra,
        playerId,
      }),
    );
  }
}

import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Payload } from '@nestjs/microservices';

import { MessagePatternDto } from '@app/nest-dto-rpc';

import { ContactType } from '@common/dto/contact.dto';
import { LoginRpcDto } from '@common/dto/rpc/login-rpc.dto';
import { RegisterRpcDto, RefreshAccessTokenRpcDto } from '@common/dto/rpc.dto';
import { UserScope } from '@common/modules/security/jwt/enum/user-scope.enum';

import { AccessTokenRefreshCommand } from '@identity/actions/access-token-refresh.command';
import { LoginCommand } from '@identity/actions/login.command';
import { RegisterCommand } from '@identity/actions/register.command';
import { LoginResponseDto } from '@identity/modules/authentication/dto/login.dto';
import { RegisterDto } from '@identity/modules/authentication/dto/register.dto';

@Controller()
export class AuthenticationController {
  constructor(private readonly commandBus: CommandBus) {}

  @MessagePatternDto(RegisterRpcDto)
  async register(dto: RegisterDto) {
    if (dto.contact.type !== ContactType.EMAIL) {
      throw new Error('Only email contacts are allowed');
    }

    const [username] = dto.contact.value.split('@');
    const command = new RegisterCommand({
      ...dto,
      username,
      scope: UserScope.ADMIN,
      contact: dto.contact,
    });

    return this.commandBus.execute(command);
  }

  @MessagePatternDto(LoginRpcDto)
  async login(dto: LoginRpcDto) {
    if (dto.contact.type !== ContactType.EMAIL) {
      throw new Error('Only email contacts are allowed');
    }

    return this.commandBus.execute(
      new LoginCommand({
        scope: UserScope.ADMIN,
        password: dto.password,
        contact: dto.contact,
      }),
    );
  }

  @MessagePatternDto(RefreshAccessTokenRpcDto)
  async refreshAccessToken(@Payload() dto: RefreshAccessTokenRpcDto): Promise<LoginResponseDto> {
    return this.commandBus.execute(new AccessTokenRefreshCommand(dto));
  }
}

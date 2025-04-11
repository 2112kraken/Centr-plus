import { FastifyRequest } from 'fastify';
import { firstValueFrom } from 'rxjs';

import { Inject } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';

import { getMessagePatternFromDto } from '@app/nest-dto-rpc';

import { LoginRpcDto } from '@common/dto/rpc/login-rpc.dto';
import { RefreshAccessTokenRpcDto, RegisterRpcDto } from '@common/dto/rpc.dto';
import { RpcClient } from '@common/modules/rpc/service-name.enum';
import { RefreshTokenRequired } from '@common/modules/security/jwt/decorators/user-id.decorator';

import { LoginDto, LoginResponseDto } from '@adminpanel/modules/authentication/dto/login.dto';
import { RegisterDto } from '@adminpanel/modules/authentication/dto/register.dto';

@Resolver(() => LoginResponseDto)
export class AuthenticationResolver {
  constructor(@Inject(RpcClient.IDENTITY) private readonly identityClient: ClientProxy) {}

  @Mutation(() => LoginResponseDto)
  async register(@Args('dto') dto: RegisterDto): Promise<LoginResponseDto> {
    return await firstValueFrom(
      this.identityClient.send<LoginResponseDto, RegisterDto>(getMessagePatternFromDto(RegisterRpcDto), dto),
    );
  }

  @Mutation(() => LoginResponseDto)
  async login(@Args('dto') dto: LoginDto) {
    return firstValueFrom(this.identityClient.send<LoginDto>(getMessagePatternFromDto(LoginRpcDto), dto));
  }

  @RefreshTokenRequired()
  @Mutation(() => LoginResponseDto)
  async refreshAccessToken(@Context('req') req: FastifyRequest): Promise<LoginResponseDto> {
    return firstValueFrom(
      this.identityClient.send<LoginResponseDto, RefreshAccessTokenRpcDto>(
        getMessagePatternFromDto(RefreshAccessTokenRpcDto),
        { refreshToken: req.headers.authorization! },
      ),
    );
  }
}

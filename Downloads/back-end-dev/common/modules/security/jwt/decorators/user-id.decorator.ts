import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';

export const ACCESS_TOKEN_REQUIRED = Symbol('ACCESS_TOKEN_REQUIRED');
export const REFRESH_TOKEN_REQUIRED = Symbol('REFRESH_TOKEN_REQUIRED');

export const AccessTokenRequired = () => SetMetadata(ACCESS_TOKEN_REQUIRED, true);
export const RefreshTokenRequired = () => SetMetadata(REFRESH_TOKEN_REQUIRED, true);

export const UserId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const [, , context] = ctx.getArgs();
  const userId = context.req.jwtPayload?.sub;

  if (!context.req.jwtPayload) {
    console.error('Add JwtConfig in DefaultModule.forRoot({configs: [JwtConfig]})');
    throw new InternalServerErrorException();
  }

  if (!userId) {
    throw new UnauthorizedException();
  }

  return userId;
});

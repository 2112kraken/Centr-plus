import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { JwtGuard } from '@common/modules/security/jwt/guards/jwt.guard';
import { TokenService } from '@common/modules/security/jwt/token.service';

@Global()
@Module({
  imports: [JwtModule],
  exports: [TokenService],
  providers: [
    TokenService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class TokenModule {}

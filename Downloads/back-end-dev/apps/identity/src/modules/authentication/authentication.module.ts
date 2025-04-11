import { Module } from '@nestjs/common';

import { AuthenticationController } from '@identity/modules/authentication/authentication.controller';
import { AuthenticationResolver } from '@identity/modules/authentication/authentication.resolver';

@Module({
  providers: [AuthenticationResolver],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}

import { Module } from '@nestjs/common';

import { AuthenticationResolver } from '@adminpanel/modules/authentication/authentication.resolver';

@Module({
  providers: [AuthenticationResolver],
})
export class AuthenticationModule {}

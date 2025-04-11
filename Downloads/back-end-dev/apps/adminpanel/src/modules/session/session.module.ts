import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Session } from '@adminpanel/modules/session/session.entity';
import { SessionResolver } from '@adminpanel/modules/session/session.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Session])],
  providers: [SessionResolver],
})
export class SessionModule {}

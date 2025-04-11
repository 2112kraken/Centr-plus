import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Session } from '@identity/modules/session/session.entity';
import { SessionService } from '@identity/modules/session/session.service';

@Module({
  imports: [TypeOrmModule.forFeature([Session])],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}

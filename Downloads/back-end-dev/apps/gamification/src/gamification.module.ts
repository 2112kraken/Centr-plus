import { PingResolver } from '@gamification/ping.resolver';

import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  providers: [PingResolver],
})
export class GamificationModule {}

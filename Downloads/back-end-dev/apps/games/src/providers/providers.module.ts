import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { InfinController } from '@games/providers/infin/infin.controller';
import { InfinService } from '@games/providers/infin/infin.service';
import { ProvidersResolver } from '@games/providers/providers.resolver';
import { ProvidersService } from '@games/providers/providers.service';

@Module({
  imports: [CqrsModule],
  providers: [InfinService, ProvidersResolver, ProvidersService],
  controllers: [InfinController],
  exports: [ProvidersService],
})
export class ProvidersModule {}

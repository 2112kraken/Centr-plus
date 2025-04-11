import { Global, Module } from '@nestjs/common';

import { GameExceptionService } from '@games/common/exception/exception.service';

@Global()
@Module({
  providers: [GameExceptionService],
  exports: [GameExceptionService],
})
export class GameExceptionModule {}

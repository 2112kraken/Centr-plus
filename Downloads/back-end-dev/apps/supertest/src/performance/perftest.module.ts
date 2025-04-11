import { Module } from '@nestjs/common';

import { PerfTestCommand } from './perftest.command';

@Module({
  imports: [],
  providers: [PerfTestCommand],
})
export class PerfTestModule {}

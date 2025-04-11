import { CommandFactory } from 'nest-commander';

import { PerformanceModule } from './performance/performance.module';

async function bootstrap() {
  await CommandFactory.run(PerformanceModule, ['warn', 'error']);
}

bootstrap();

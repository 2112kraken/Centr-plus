import { Command, CommandRunner, Option } from 'nest-commander';

import { Injectable } from '@nestjs/common';

import { runLoadTest, printStats } from './framework';
import { TestRegistryService } from './services/test-registry.service';

interface PerfTestOptions {
  connections: number;
  duration: number;
  test: string;
}

const MAX_CONNECTIONS = 1000;
const MAX_DURATION = 300; // 5 minutes max
const MIN_CONNECTIONS = 1;
const MIN_DURATION = 1;

@Injectable()
@Command({
  name: 'perftest',
  description: 'Run performance tests',
})
export class PerfTestCommand extends CommandRunner {
  constructor(private readonly testRegistry: TestRegistryService) {
    super();
  }

  async run(passedParams: string[], options: PerfTestOptions): Promise<void> {
    const { connections, duration, test } = options;

    try {
      const testInstance = this.testRegistry.getTest(test);
      console.log(`\nRunning test: ${testInstance.description}`);

      if (testInstance.setup) {
        await testInstance.setup();
      }

      const results = await runLoadTest(duration, connections, () => testInstance.execute());

      printStats(results, duration);
    } catch (error) {
      console.error('Test failed:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }

  @Option({
    flags: '-c, --connections <number>',
    description: `Number of concurrent connections (${MIN_CONNECTIONS}-${MAX_CONNECTIONS})`,
    required: true,
  })
  parseConnections(val: string): number {
    const connections = Number(val);

    if (isNaN(connections)) {
      throw new Error('Connections must be a number');
    }

    if (connections < MIN_CONNECTIONS || connections > MAX_CONNECTIONS) {
      throw new Error(`Connections must be between ${MIN_CONNECTIONS} and ${MAX_CONNECTIONS}`);
    }

    return connections;
  }

  @Option({
    flags: '-d, --duration <seconds>',
    description: `Test duration in seconds (${MIN_DURATION}-${MAX_DURATION})`,
    required: true,
  })
  parseDuration(val: string): number {
    const duration = Number(val);

    if (isNaN(duration)) {
      throw new Error('Duration must be a number');
    }

    if (duration < MIN_DURATION || duration > MAX_DURATION) {
      throw new Error(`Duration must be between ${MIN_DURATION} and ${MAX_DURATION} seconds`);
    }

    return duration;
  }

  @Option({
    flags: '-t, --test <name>',
    description: 'Test to run',
    required: true,
  })
  parseTest(val: string): string {
    const availableTests = this.testRegistry.getAvailableTests();
    if (!availableTests.includes(val)) {
      const descriptions = this.testRegistry
        .getTestDescriptions()
        .map(({ name, description }: { name: string; description: string }) => `  ${name}: ${description}`)
        .join('\n');

      throw new Error(`Invalid test name. Available tests:\n${descriptions}`);
    }
    return val;
  }
}

import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import { PerformanceTest, PERFORMANCE_TEST } from '../base.perftest';

@Injectable()
export class TestRegistryService implements OnModuleInit {
  private tests = new Map<string, PerformanceTest>();

  constructor(
    @Inject(PERFORMANCE_TEST)
    private readonly performanceTests: PerformanceTest[],
  ) {}

  async onModuleInit() {
    this.performanceTests.forEach((test) => this.registerTest(test));
  }

  registerTest(test: PerformanceTest): void {
    if (this.tests.has(test.name)) {
      throw new Error(`Test "${test.name}" is already registered`);
    }
    this.tests.set(test.name, test);
  }

  getTest(name: string): PerformanceTest {
    const test = this.tests.get(name);
    if (!test) {
      throw new Error(`Test "${name}" not found`);
    }
    return test;
  }

  getAvailableTests(): string[] {
    return Array.from(this.tests.keys());
  }

  getTestDescriptions(): Array<{ name: string; description: string }> {
    return Array.from(this.tests.entries()).map(([name, test]) => ({
      name,
      description: test.description,
    }));
  }
}

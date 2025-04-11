/**
 * Interface for performance tests
 */
export interface PerformanceTest {
  /**
   * Unique identifier for the test
   */
  readonly name: string;

  /**
   * Human-readable description of the test
   */
  readonly description: string;

  /**
   * Execute a single test iteration
   */
  execute(): Promise<void>;

  setup?(): Promise<void>;
}

export const PERFORMANCE_TEST = 'PERFORMANCE_TEST';

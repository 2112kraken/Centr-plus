import { performance } from 'perf_hooks';

interface TestResult {
  duration: number; // Duration in milliseconds
  success: boolean;
}

interface Stats {
  p1: number;
  p2_5: number;
  p50: number;
  p97_5: number;
  p99: number;
  avg: number;
  stdev: number;
  max: number;
  min: number;
}

/**
 * Calculate percentile value from sorted array
 * @param values Sorted array of numbers
 * @param percentile Percentile (0-1)
 */
function getPercentile(values: number[], percentile: number): number {
  if (!values.length) return 0;
  const index = Math.floor(values.length * percentile);
  return values[index];
}

/**
 * Calculate statistical metrics from array of values
 */
function calculateStats(values: number[]): Stats {
  if (!values.length) {
    return {
      p1: 0,
      p2_5: 0,
      p50: 0,
      p97_5: 0,
      p99: 0,
      avg: 0,
      stdev: 0,
      max: 0,
      min: 0,
    };
  }

  values.sort((a, b) => a - b);

  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / values.length;

  return {
    p1: getPercentile(values, 0.01),
    p2_5: getPercentile(values, 0.025),
    p50: getPercentile(values, 0.5),
    p97_5: getPercentile(values, 0.975),
    p99: getPercentile(values, 0.99),
    avg,
    stdev: Math.sqrt(variance),
    max: values[values.length - 1],
    min: values[0],
  };
}

/**
 * Run single worker for specified duration
 */
async function runWorker(test: () => Promise<void>, durationMs: number): Promise<TestResult[]> {
  const results: TestResult[] = [];
  const endTime = Date.now() + durationMs;

  while (Date.now() < endTime) {
    const start = performance.now();
    try {
      await test();
      results.push({
        duration: performance.now() - start,
        success: true,
      });
    } catch (error: unknown) {
      console.error('Test error:', error);
      results.push({
        duration: performance.now() - start,
        success: false,
      });
    }
  }

  return results;
}

/**
 * Run load test with multiple parallel workers
 * @param durationSec Test duration in seconds
 * @param connections Number of parallel connections
 * @param test Test function to execute
 */
export async function runLoadTest(
  durationSec: number,
  connections: number,
  test: () => Promise<void>,
): Promise<TestResult[]> {
  // Validate input parameters
  if (durationSec <= 0) throw new Error('Duration must be positive');
  if (connections <= 0) throw new Error('Connections must be positive');
  if (!test) throw new Error('Test function is required');

  const durationMs = durationSec * 1000;
  const workers: Promise<TestResult[]>[] = [];

  console.log(`Running ${durationSec}s test`);
  console.log(`${connections} connections\n`);

  // Start parallel workers
  for (let i = 0; i < connections; i++) {
    workers.push(runWorker(test, durationMs));
  }

  // Wait for all workers and combine results
  const workerResults = await Promise.all(workers);
  return workerResults.flat();
}

/**
 * Format number with k/M suffix
 */
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(2)}k`;
  }
  return num.toFixed(2);
}

/**
 * Format duration in milliseconds
 */
function formatDuration(ms: number): string {
  return `${ms.toFixed(2)} ms`;
}

/**
 * Print test statistics in table format
 */
export function printStats(results: TestResult[], durationSec: number): void {
  if (!results.length) {
    console.log('No test results available');
    return;
  }

  const successfulResults = results.filter((r) => r.success);
  if (!successfulResults.length) {
    console.log('No successful requests');
    return;
  }

  const latencies = successfulResults.map((r) => r.duration);
  const latencyStats = calculateStats(latencies);

  const totalRequests = results.length;
  const successfulRequests = successfulResults.length;
  const reqPerSec = successfulRequests / durationSec;

  // Latency Table
  console.table({
    Latency: {
      '2.5%': formatDuration(latencyStats.p2_5),
      '50%': formatDuration(latencyStats.p50),
      '97.5%': formatDuration(latencyStats.p97_5),
      '99%': formatDuration(latencyStats.p99),
      Avg: formatDuration(latencyStats.avg),
      Stdev: formatDuration(latencyStats.stdev),
      Max: formatDuration(latencyStats.max),
    },
  });

  // Requests Table
  console.table({
    'Req/Sec': {
      '1%': formatNumber(reqPerSec),
      '2.5%': formatNumber(reqPerSec),
      '50%': formatNumber(reqPerSec),
      '97.5%': formatNumber(reqPerSec),
      Avg: formatNumber(reqPerSec),
      Stdev: '0',
      Min: formatNumber(reqPerSec),
    },
  });

  // Summary
  console.log(`\n${formatNumber(totalRequests)} requests in ${durationSec}s`);
  console.log(`Success Rate: ${((successfulRequests / totalRequests) * 100).toFixed(2)}%`);
}

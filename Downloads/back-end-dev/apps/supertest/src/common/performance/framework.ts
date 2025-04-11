import { Worker } from 'worker_threads';

export interface TestResult {
  time: number;
  success: boolean;
  msg?: string;
}

export interface WorkerResult {
  times: number[];
  successfulRequests: number;
  errorCount: number;
}

export interface TestStats {
  max: number;
  min: number;
  avg: number;
  totalRequests: number;
  successfulRequests: number;
  errorCount: number;
  successRate: string;
  totalTime: number;
}

export type TestFunction = (iteration: number) => Promise<any>;

export function chunks<T>(array: T[], chunkSize: number): T[][] {
  if (chunkSize <= 0) {
    throw new Error('Chunk size must be greater than 0');
  }

  const chunks: T[][] = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }

  return chunks;
}

export async function runWorker(testFn: TestFunction, requestCount: number): Promise<WorkerResult> {
  const results: TestResult[] = [];
  const requests = Array(requestCount)
    .fill(null)
    .map((_, index) => index);

  for (const chunk of chunks(requests, 10)) {
    const startAt = Date.now();
    await Promise.all(
      chunk.map(async (index) => {
        try {
          const startTime = Date.now();
          await testFn(index);
          results.push({ time: Date.now() - startTime, success: true });
        } catch (error: any) {
          results.push({ time: 0, success: false, msg: error.message });
        }
      }),
    );
    console.log(`chunk time ${chunk.at(0)} - ${chunk.at(-1)}. ${Math.round((Date.now() - startAt) / 10)}ms`);
  }

  const successfulResults = results.filter((r) => r.success);
  const failedResults = results.filter((r) => !r.success);

  return {
    times: successfulResults.map((r) => r.time),
    successfulRequests: successfulResults.length,
    errorCount: failedResults.length,
  };
}

export async function runLoadTest(testPath: string, totalRequests: number, workerCount: number): Promise<TestStats> {
  const startTime = Date.now();
  const requestsPerWorker = Math.ceil(totalRequests / workerCount);

  console.log(`Starting ${workerCount} workers with ${requestsPerWorker} requests each...`);

  const workers = Array(workerCount)
    .fill(null)
    .map(() => {
      return new Promise<WorkerResult>((resolve, reject) => {
        const worker = new Worker(testPath, {
          workerData: { requestCount: requestsPerWorker },
        });

        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
          if (code !== 0) {
            reject(new Error(`Worker stopped with exit code ${code}`));
          }
        });
      });
    });

  const results = await Promise.all(workers);
  const allTimes = results.flatMap((r) => r.times);
  const totalSuccessful = results.reduce((sum, r) => sum + r.successfulRequests, 0);
  const totalErrors = results.reduce((sum, r) => sum + r.errorCount, 0);

  return {
    max: Math.max(...allTimes),
    min: Math.min(...allTimes),
    avg: allTimes.reduce((sum, time) => sum + time, 0) / allTimes.length,
    totalRequests: totalSuccessful + totalErrors,
    successfulRequests: totalSuccessful,
    errorCount: totalErrors,
    successRate: ((totalSuccessful / (totalSuccessful + totalErrors)) * 100).toFixed(2),
    totalTime: Date.now() - startTime,
  };
}

export function printStats(stats: TestStats): void {
  console.table([
    {
      Metric: 'Max Response Time',
      Value: `${(stats.max / 1000).toFixed(2)}s`,
    },
    {
      Metric: 'Min Response Time',
      Value: `${(stats.min / 1000).toFixed(2)}s`,
    },
    {
      Metric: 'Avg Response Time',
      Value: `${(stats.avg / 1000).toFixed(2)}s`,
    },
    { Metric: 'Total Requests', Value: stats.totalRequests },
    { Metric: 'Successful Requests', Value: stats.successfulRequests },
    { Metric: 'Failed Requests', Value: stats.errorCount },
    { Metric: 'Success Rate', Value: `${stats.successRate}%` },
    {
      Metric: 'Total Execution Time',
      Value: `${(stats.totalTime / 1000).toFixed(2)}s`,
    },
  ]);
}

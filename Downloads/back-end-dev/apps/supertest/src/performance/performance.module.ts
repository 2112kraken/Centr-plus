import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { RpcClient } from '@common/modules/rpc/service-name.enum';

import { InfinTest } from '@supertest/performance/tests/infin.perftest';

import { PERFORMANCE_TEST } from './base.perftest';
import { PerfTestCommand } from './perftest.command';
import { TestRegistryService } from './services/test-registry.service';
import { BalanceAccountTest } from './tests/balance-account.perftest';
import { RegistrationTest } from './tests/registration.perftest';

const TEST_CLASSES = [RegistrationTest, BalanceAccountTest, InfinTest];

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          name: RpcClient.BALANCE,
          useFactory: () => ({
            transport: Transport.TCP,
            options: {
              port: parseInt(process.env.BALANCE_RPC_PORT || '5002', 10),
              host: process.env.BALANCE_HOST || 'localhost',
            },
          }),
        },
      ],
    }),
  ],
  providers: [
    PerfTestCommand,
    TestRegistryService,
    ...TEST_CLASSES,
    {
      provide: PERFORMANCE_TEST,
      useFactory: (...tests: any[]) => tests,
      inject: TEST_CLASSES,
    },
  ],
})
export class PerformanceModule {}

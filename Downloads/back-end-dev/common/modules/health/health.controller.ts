import { FastifyRequest } from 'fastify';

import { Controller, Get, Req } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

import { ServicesHealthIndicator } from './health.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly servicesHealth: ServicesHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    return this.health.check(this.servicesHealth.getHealthIndicators());
  }

  @Get('debug')
  async debug(@Req() req: FastifyRequest) {
    return {
      headers: req.headers,
      method: req.method,
    };
  }
}

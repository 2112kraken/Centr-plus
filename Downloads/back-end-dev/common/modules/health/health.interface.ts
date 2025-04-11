export enum HealthCheck {
  DB = 'database',
  KAFKA = 'kafka',
  REDIS = 'redis',
}

export interface HealthModuleOptions {
  healthCheck: HealthCheck[];
}

import { validateSync } from 'class-validator';

export class BaseConfig {
  protected asNumber(envName: string, def: number): number;
  protected asNumber(envName: string, def?: number): number | undefined;
  protected asNumber(envName: string, def?: number): number | undefined {
    const env = this.env[envName];
    return env ? Number(env) : def;
  }

  protected asString(envName: string, def: number): string;
  protected asString(envName: string, def?: string): string;
  protected asString(envName: string, def?: string | number): string {
    const env = this.env[envName];
    return typeof env === 'string' ? env : def?.toString() || '';
  }

  protected asStringOrThrow<T extends string>(envName: string, def?: T): T {
    const val = this.env[envName] || def;

    if (!val) {
      throw new Error(`Env "${envName}" is required.`);
    }

    return val as T;
  }

  protected asNumberOrThrow<T extends number>(envName: string, def?: T): T {
    const val = Number(this.env[envName]) || def;

    if (typeof val !== 'number') {
      throw new Error(`Env "${envName}" is required.`);
    }

    return val as T;
  }

  protected asJson<T>(envName: string, def?: T): T {
    const envValue = this.env[envName];
    const val = envValue ? JSON.parse(envValue) : def;

    if (!val) {
      throw new Error(`Env "${envName}" is required.`);
    }

    return val as T;
  }

  protected asBoolean(envName: string, def = false): boolean {
    const value = this.asString(envName, '');
    return value === 'true' || def;
  }

  protected asArray(envName: string): string[] | undefined {
    const value = this.env[envName];
    return value ? value.split(',') : undefined;
  }

  protected validate(): void {
    const errors = validateSync(this);

    if (errors.length === 0) {
      return;
    }

    throw new Error(`Invalid configuration: ${errors.join('\n')}`);
  }

  protected get env(): Record<string, string | undefined> {
    return process.env;
  }
}

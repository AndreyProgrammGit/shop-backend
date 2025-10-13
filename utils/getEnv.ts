import { ConfigService } from '@nestjs/config';

export function getEnv(configService: ConfigService, key: string): string {
  const value = configService.get(key) as string;
  if (typeof value !== 'string')
    throw new Error(`Missing or invalid env variable: ${key}`);
  return value;
}

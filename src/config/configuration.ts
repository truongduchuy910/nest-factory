/**
 * ⚙️  CONFIGURATION
 * https://docs.nestjs.com/techniques/configuration#custom-configuration-files
 */
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export interface GRPConfig {
  name: string;
  url: string;
  port: number;
}

export const cors: CorsOptions = {
  origin: [
    'http://localhost:4004',
    'http://localhost:4003',
    'http://localhost:4002',
    'http://localhost:4001',
    'http://localhost:4000',
    'http://localhost:3004',
    'http://localhost:3003',
    'http://localhost:3002',
    'http://localhost:3001',
    'http://localhost:3000',
  ],
  credentials: true,
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Access-Control-Allow-Credentials',
    'Authorization',
    'Apollo-Require-Preflight',
    'X-Apollo-Operation-Name',
  ],
};

const mode = {
  localhost: {},
  staging: {},
  production: {},
};

export default () =>
  Object.assign(mode[process.env.MODE], {
    cors,
    internals: cors.origin,
  });

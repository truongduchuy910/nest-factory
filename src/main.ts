import { NestFactory } from '@nestjs/core';
import { yellow } from 'chalk';
import { AppModule } from './app.module';
import { cors } from './config/configuration';

import type { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  const configService = app.get(ConfigService);
  const mode = configService.get('MODE');
  app.enableCors(cors[mode]);

  console.log(yellow(`  _      _      _    `.repeat(2)));
  console.log(yellow(`>(.)__ <(.)__ =(.)__ `.repeat(2)));
  console.log(yellow(` (___/  (___/  (___/ `.repeat(2)));

  await app.listen(3000);
}

bootstrap();

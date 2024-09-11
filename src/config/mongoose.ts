/**
 * ⚙️  MONGODB
 * https://docs.nestjs.com/techniques/mongodb
 */

import { ConfigModule, ConfigService } from '@nestjs/config';
import type { MongooseModuleAsyncOptions } from '@nestjs/mongoose';

export const mongooseOptions: MongooseModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const uri = configService.get<string>('MONGO_CONNECTION');
    return { uri };
  },
};

/**
 * 📌 MONGO MODULE
 */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoSchema, MongoSchemaFactory } from './mongo.schema';
import { MongoService } from './mongo.service';
import { MongoResolver } from './mongo.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MongoSchema.name,
        schema: MongoSchemaFactory,
      },
    ]),
  ],
  providers: [MongoService, MongoResolver],
  exports: [MongoService],
})
export class MongoModule {}

export * from './mongo.args';
export * from './mongo.entity';

export { MongoResolver, MongoSchema, MongoService };

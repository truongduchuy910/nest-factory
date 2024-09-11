/**
 * 📌 EXAMPLE MODULE
 */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExampleSchema, ExampleSchemaFactory } from './example.schema';
import { ExampleService } from './example.service';
import { ExampleResolver } from './example.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ExampleSchema.name,
        schema: ExampleSchemaFactory,
      },
    ]),
  ],
  providers: [ExampleService, ExampleResolver],
  exports: [ExampleService],
})
export class ExampleModule {}

export * from './example.args';
export * from './example.entity';

export { ExampleResolver, ExampleSchema, ExampleService };

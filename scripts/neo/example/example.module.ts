/**
 * 📌 EXAMPLE MODULE
 */

import { Module } from '@nestjs/common';
import { Neo4jModule } from 'nest-ogm';

import { ExampleService } from './example.service';
import { ExampleResolver } from './example.resolver';
import { typeDefs } from './example.node';
import { ExampleEntity } from './example.entity';

@Module({
  imports: [
    Neo4jModule.forFeature([{ name: ExampleEntity.nodeName, typeDefs }]),
  ],
  providers: [ExampleService, ExampleResolver],
  exports: [ExampleService, Neo4jModule],
})
export class ExampleModule {}

export * from './example.args';
export * from './example.interface';

export { ExampleResolver, ExampleService };

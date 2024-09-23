/**
 * 📌 EXAMPLE MODULE
 */

import { Module } from '@nestjs/common';
import { ExampleService } from './example.service';
import { ExampleResolver } from './example.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ExampleService, ExampleResolver],
  exports: [ExampleService],
})
export class ExampleModule {}

export * from './example.args';
export * from './example.entity';

export { ExampleResolver, ExampleService };

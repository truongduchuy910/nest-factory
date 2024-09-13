/**
 * 📌 PRIS MODULE
 */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrisSchema, PrisSchemaFactory } from './pris.schema';
import { PrisService } from './pris.service';
import { PrisResolver } from './pris.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PrisSchema.name,
        schema: PrisSchemaFactory,
      },
    ]),
  ],
  providers: [PrisService, PrisResolver],
  exports: [PrisService],
})
export class PrisModule {}

export * from './pris.args';
export * from './pris.entity';

export { PrisResolver, PrisSchema, PrisService };

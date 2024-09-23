/**
 * 📌 NEO MODULE
 */

import { Module } from '@nestjs/common';
import { Neo4jModule } from 'nest-ogm';

import { NeoService } from './neo.service';
import { NeoResolver } from './neo.resolver';
import { typeDefs } from './neo.node';
import { NeoEntity } from './neo.entity';

@Module({
  imports: [
    Neo4jModule.forFeature([{ name: NeoEntity.nodeName, typeDefs }]),
  ],
  providers: [NeoService, NeoResolver],
  exports: [NeoService, Neo4jModule],
})
export class NeoModule {}

export * from './neo.args';
export * from './neo.interface';

export { NeoResolver, NeoService };

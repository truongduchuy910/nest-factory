/**
 * 📌 NEO_4_J MODULE
 */

import { Module } from '@nestjs/common';
import { Neo4jModule } from 'nest-ogm';

import { Neo4jService } from './neo4j.service';
import { Neo4jResolver } from './neo4j.resolver';
import { typeDefs } from './neo4j.node';
import { Neo4jEntity } from './neo4j.entity';

@Module({
  imports: [Neo4jModule.forFeature([{ name: Neo4jEntity.nodeName, typeDefs }])],
  providers: [Neo4jService, Neo4jResolver],
  exports: [Neo4jService, Neo4jModule],
})
export class Neo4jModule {}

export * from './neo4j.args';
export * from './neo4j.interface';

export { Neo4jResolver, Neo4jService };

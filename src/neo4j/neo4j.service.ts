/**
 * 📌 NEO_4_J SERVICE
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectNode, Node } from 'nest-ogm';

import { Neo4jNeo4j } from './neo4j.node';
import { Neo4jEntity } from './neo4j.entity';

@Injectable()
export class Neo4jService extends Neo4jNeo4j {
  readonly logger = new Logger(Neo4jService.name);

  constructor(@InjectNode(Neo4jEntity.nodeName) node: Node) {
    super(node as any);
  }
}

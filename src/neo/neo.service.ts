/**
 * 📌 NEO SERVICE
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectNode, Node } from 'nest-ogm';

import { NeoNeo4j } from './neo.node';
import { NeoEntity } from './neo.entity';

@Injectable()
export class NeoService extends NeoNeo4j {
  readonly logger = new Logger(NeoService.name);

  constructor(@InjectNode(NeoEntity.nodeName) node: Node) {
    super(node as any);
  }
}

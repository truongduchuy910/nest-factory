/**
 * 📌 EXAMPLE SERVICE
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectNode, Node } from 'nest-ogm';

import { ExampleNeo4j } from './example.node';
import { ExampleEntity } from './example.entity';

@Injectable()
export class ExampleService extends ExampleNeo4j {
  readonly logger = new Logger(ExampleService.name);

  constructor(@InjectNode(ExampleEntity.nodeName) node: Node) {
    super(node as any);
  }
}

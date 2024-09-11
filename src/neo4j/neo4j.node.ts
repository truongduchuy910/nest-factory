/**
 * 📌 NEO_4_J TYPE DEFINE
 */

import gql from 'graphql-tag';
import { Injectable } from '@nestjs/common';
import { Neo4jEntity } from './neo4j.entity';
import { Neo4j } from 'libs/nest-nepa/src/neo4j.node';

/**
 * typeDefs should implements base on neo4j.interface.ts
 */

export const typeDefs = gql`
  type Neo4j
    @fulltext(indexes: [{ indexName: "text", fields: ["createdBy"] }]) {
    " neo4j identity "
    id: ID @id
    " created at "
    createdAt: DateTime
    " created by "
    createdBy: String
    " number "
    number: Float
  }
`;

/**
 * 📌 NEO_4_J NEO4J
 */

@Injectable()
export class Neo4jNeo4j extends Neo4j {
  fieldMany = 'neo4js';
  selectionSet = gql`
    {
      id
      createdBy
      createdAt
      number
    }
  `;
  toEntity(node: any) {
    return new Neo4jEntity(node);
  }
}

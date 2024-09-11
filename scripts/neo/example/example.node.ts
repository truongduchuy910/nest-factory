/**
 * 📌 EXAMPLE TYPE DEFINE
 */

import gql from 'graphql-tag';
import { Injectable } from '@nestjs/common';
import { ExampleEntity } from './example.entity';
import { Neo4j } from 'libs/nest-nepa/src/neo4j.node';

/**
 * typeDefs should implements base on example.interface.ts
 */

export const typeDefs = gql`
  type Example
    @fulltext(indexes: [{ indexName: "text", fields: ["createdBy"] }]) {
    " example identity "
    id: ID @id
    " created at "
    createdAt: DateTime @unique
    " created by "
    createdBy: String @unique
    " number "
    number: Float @unique
  }
`;

/**
 * 📌 EXAMPLE NEO4J
 */

@Injectable()
export class ExampleNeo4j extends Neo4j {
  fieldMany = 'examples';
  selectionSet = gql`
    {
      id
      createdBy
      createdAt
      number
    }
  `;
  toEntity(node: any) {
    return new ExampleEntity(node);
  }
}

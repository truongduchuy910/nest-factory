/**
 * 📌 NEO TYPE DEFINE
 */

import gql from 'graphql-tag';
import { Injectable } from '@nestjs/common';
import { NeoEntity } from './neo.entity';
import { Neo4j } from 'libs/nest-nepa/src/neo4j.node';

/**
 * typeDefs should implements base on neo.interface.ts
 */

export const typeDefs = gql`
  type Neo
    @fulltext(indexes: [{ indexName: "text", fields: ["createdBy"] }]) {
    " neo identity "
    id: ID @id
    " created at "
    createdAt: DateTime
    " created by "
    createdBy: String

    string: String @unique
    date: DateTime @unique
    number: Float @unique
  }
`;

/**
 * 📌 NEO NEO4J
 */

@Injectable()
export class NeoNeo4j extends Neo4j {
  fieldMany = 'neos';
  selectionSet = gql`
    {
      id
      createdBy
      createdAt

      string
      date
      number
    }
  `;

  toEntity(node: any) {
    return new NeoEntity(node);
  }
}

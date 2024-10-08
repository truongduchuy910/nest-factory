/**
 * 📌 EXAMPLE TYPE DEFINE
 */

import gql from 'graphql-tag';
import { Injectable } from '@nestjs/common';
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
    createdAt: DateTime
    " created by "
    createdBy: String

    string: String @unique
    date: DateTime @unique
    number: Float @unique
    label: String
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

      string
      date
      number
    }
  `;
}

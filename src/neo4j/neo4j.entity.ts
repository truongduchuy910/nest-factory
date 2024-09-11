/**
 * 📌 NEO_4_J ENTITY
 */

import {
  Directive,
  Field,
  GraphQLISODateTime,
  ID,
  ObjectType,
} from '@nestjs/graphql';
import { pickBy } from 'lodash';

import { Neo4jInterface } from './neo4j.interface';
import { PagingEntity } from 'nest-nepa';

@ObjectType({
  description: 'Type of neo4j entity. Base on neo4j interface.',
})
@Directive(`@key(fields: "id")`)
export class Neo4jEntity implements Neo4jInterface {
  static nodeName = 'Neo4j';
  @Field(() => ID, { nullable: false })
  id?: string;

  @Field(() => String, { nullable: true })
  createdBy?: string;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
  })
  createdAt?: Date;

  @Field(() => Number, {
    nullable: true,
  })
  number?: number;

  constructor(partial: any) {
    Object.assign(this, partial);
    if (!this.createdAt) {
      this.createdAt = new Date();
    } else {
      this.createdAt = new Date(this.createdAt);
    }
  }

  /**
   * only attributes
   */

  lean(): Neo4jInterface {
    return {
      id: this.id,
      createdAt: this.createdAt,
      createdBy: this.createdBy,
    };
  }

  toNode() {
    return {
      createdAt: this.createdAt.toISOString(),
      createdBy: this.createdBy,
    };
  }
  toUpdateInput() {
    return {
      createdAt: this.createdAt.toISOString(),
      createdBy: this.createdBy,
    };
  }

  toCreateInput() {
    return pickBy({
      createdAt: this.createdAt.toISOString(),
      createdBy: this.createdBy,
      number: this.number,
    });
  }
}

@ObjectType({ description: 'Type of neo4j entity list response' })
export class ManyNeo4j {
  @Field(() => [Neo4jEntity], { defaultValue: [] })
  data: Array<Neo4jEntity>;

  @Field({ nullable: true })
  paging: PagingEntity;
}

/**
 * 📌 NEO ENTITY
 */

import {
  Directive,
  Field,
  GraphQLISODateTime,
  ID,
  ObjectType,
} from '@nestjs/graphql';
import { pickBy } from 'lodash';

import { NeoInterface } from './neo.interface';
import { PagingEntity } from 'nest-nepa';

@ObjectType({
  description: 'Type of neo entity. Base on neo interface.',
})
@Directive(`@key(fields: "id")`)
export class NeoEntity implements NeoInterface {
  static nodeName = 'Neo';
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

  lean(): NeoInterface {
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

@ObjectType({ description: 'Type of neo entity list response' })
export class ManyNeo {
  @Field(() => [NeoEntity], { defaultValue: [] })
  data: Array<NeoEntity>;

  @Field({ nullable: true })
  paging: PagingEntity;
}

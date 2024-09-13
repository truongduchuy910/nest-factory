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
import { PagingEntity } from 'nest-gfc';

@ObjectType({
  description: 'Type of neo entity. Base on neo interface.',
})
@Directive(`@key(fields: "id")`)
export class NeoEntity implements NeoInterface {
  static nodeName = 'Neo';
  @Field(() => ID, { nullable: true })
  id?: string;

  @Field(() => String, { nullable: true })
  createdBy?: string;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
  })
  createdAt?: Date;

  @Field(() => String, {
    nullable: true,
  })
  string?: string;

  @Field(() => Number, {
    nullable: true,
  })
  number?: number;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
  })
  date?: Date;

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

  /*
   * DPRECATED
   * Use NeoUpdateInputType.toUpdateInput instead
   */
  toUpdateInput() {
    return {
      createdAt: this.createdAt.toISOString(),
      createdBy: this.createdBy,
    };
  }

  /*
   * DPRECATED
   * Use NeoCreateInputType.toCreateInput instead
   */
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

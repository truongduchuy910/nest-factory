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

  @Field(() => String, {
    nullable: true,
  })
  label?: string;

  constructor(node) {
    Object.assign(this, node);
    this.date = this.date && new Date(this.date);
  }

  toEntity() {
    return this;
  }
}

@ObjectType({ description: 'Type of neo entity list response' })
export class ManyNeoEntity {
  @Field(() => [NeoEntity], { defaultValue: [] })
  data: Array<NeoEntity>;

  @Field({ nullable: true })
  paging: PagingEntity;
}

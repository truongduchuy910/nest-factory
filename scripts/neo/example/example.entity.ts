/**
 * 📌 EXAMPLE ENTITY
 */

import {
  Directive,
  Field,
  GraphQLISODateTime,
  ID,
  ObjectType,
} from '@nestjs/graphql';

import { ExampleInterface } from './example.interface';
import { PagingEntity } from 'nest-gfc';

@ObjectType({
  description: 'Type of example entity. Base on example interface.',
})
@Directive(`@key(fields: "id")`)
export class ExampleEntity implements ExampleInterface {
  static nodeName = 'Example';
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

@ObjectType({ description: 'Type of example entity list response' })
export class ManyExampleEntity {
  @Field(() => [ExampleEntity], { defaultValue: [] })
  data: Array<ExampleEntity>;

  @Field({ nullable: true })
  paging: PagingEntity;
}

/**
 * 📌 EXAMPLE ENTITY
 */

import { PagingEntity } from 'nemopa';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { ExampleSchema } from './example.schema';

// import { PagingEntity } from "../common/entities";

@ObjectType()
export class ExampleEntity extends ExampleSchema {
  @Field(() => ID, { nullable: false })
  id?: string;

  @Field(() => String, { nullable: true })
  label?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  createdAt?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  updatedAt?: Date;
}

@ObjectType()
export class ManyExampleEntity {
  @Field(() => [ExampleEntity], { defaultValue: [] })
  data: Array<ExampleEntity>;

  @Field({ nullable: true })
  paging: PagingEntity;
}

/**
 * 📌 EXAMPLE ENTITY
 */

import { PagingEntity } from 'nest-mopa';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { ExampleSchema } from './example.schema';

@ObjectType()
export class ExampleEntity extends ExampleSchema {
  @Field(() => ID, { nullable: false })
  id?: string;

  @Field(() => String, { nullable: true })
  string?: string;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
  })
  date?: Date;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
  })
  numner?: number;
}

@ObjectType()
export class ManyExampleEntity {
  @Field(() => [ExampleEntity], {
    defaultValue: [],
    description: 'data return as array',
  })
  data: Array<ExampleEntity>;

  @Field({ nullable: true, description: 'pagination' })
  paging: PagingEntity;
}

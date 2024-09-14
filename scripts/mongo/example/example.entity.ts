/**
 * 📌 EXAMPLE ENTITY
 */

import { PagingEntity } from 'nest-gfc';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { ExampleSchema } from './example.schema';

@ObjectType()
export class ExampleEntity extends ExampleSchema {
  @Field(() => ID, { nullable: false })
  id?: string;

  @Field(() => String, { nullable: true })
  label?: string;

  @Field(() => String, { nullable: true })
  string?: string;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
  })
  date?: Date;

  @Field(() => Number, {
    nullable: true,
  })
  number?: number;
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

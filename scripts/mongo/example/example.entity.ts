/**
 * 📌 EXAMPLE ENTITY
 */

import { PagingEntity } from 'nest-gfc';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { ExampleSchema, ExampleSchemaFactory } from './example.schema';

@ObjectType()
export class ExampleEntity extends ExampleSchema {
  /*
   * methods in this class can use in document which return by mongoose method
   */
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

  @Field(() => Number, {
    nullable: true,
  })
  duplicate?: number;

  toEntity() {
    return this;
  }
}

ExampleSchemaFactory.loadClass(ExampleEntity);

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

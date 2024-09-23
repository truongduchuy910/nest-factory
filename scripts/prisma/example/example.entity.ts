/**
 * 📌 EXAMPLE ENTITY
 */

import { PagingEntity } from 'nest-gfc';
import {
  Directive,
  Field,
  GraphQLISODateTime,
  ObjectType,
} from '@nestjs/graphql';
import { example as ExampleInterface } from '@prisma/client';

@ObjectType({
  description: 'Type of example entity. Base on example interface.',
})
@Directive(`@key(fields: "id")`)
export class ExampleEntity implements ExampleInterface {
  @Field(() => Number, {
    nullable: true,
  })
  id: number;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
  })
  created_at: Date;

  @Field(() => String, {
    nullable: true,
  })
  string: string;

  @Field(() => Number, {
    nullable: true,
  })
  number: number;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
  })
  date: Date;

  @Field(() => Number, {
    nullable: true,
  })
  duplicate: number | null;

  @Field(() => String, {
    nullable: true,
  })
  label: string;

  constructor(partial: Partial<ExampleEntity>) {
    Object.assign(this, partial);
  }

  toEntity() {
    return this;
  }
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

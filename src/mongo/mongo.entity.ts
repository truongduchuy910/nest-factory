/**
 * 📌 MONGO ENTITY
 */

import { PagingEntity } from 'nest-gfc';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { MongoSchema } from './mongo.schema';

@ObjectType()
export class MongoEntity extends MongoSchema {
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
export class ManyMongoEntity {
  @Field(() => [MongoEntity], {
    defaultValue: [],
    description: 'data return as array',
  })
  data: Array<MongoEntity>;

  @Field({ nullable: true, description: 'pagination' })
  paging: PagingEntity;
}

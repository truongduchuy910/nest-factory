/**
 * 📌 MONGO ENTITY
 */

import { PagingEntity } from 'nest-gfc';
import {
  Directive,
  Field,
  GraphQLISODateTime,
  ID,
  ObjectType,
} from '@nestjs/graphql';
import { MongoSchema, MongoSchemaFactory } from './mongo.schema';

@ObjectType({
  description: 'Type of mongo entity. Base on mongo interface.',
})
@Directive(`@key(fields: "id")`)
export class MongoEntity extends MongoSchema {
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

MongoSchemaFactory.loadClass(MongoEntity);

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

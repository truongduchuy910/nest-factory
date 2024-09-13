/**
 * 📌 PRIS ENTITY
 */

import { PagingEntity } from 'nest-gfc';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { PrisSchema } from './pris.schema';

@ObjectType()
export class PrisEntity extends PrisSchema {
  @Field(() => ID, { nullable: false })
  id?: string;

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
export class ManyPrisEntity {
  @Field(() => [PrisEntity], {
    defaultValue: [],
    description: 'data return as array',
  })
  data: Array<PrisEntity>;

  @Field({ nullable: true, description: 'pagination' })
  paging: PagingEntity;
}

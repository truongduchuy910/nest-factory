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
import { pickBy } from 'lodash';

import { ExampleInterface } from './example.interface';
import { PagingEntity } from 'nest-nepa';

@ObjectType({
  description: 'Type of example entity. Base on example interface.',
})
@Directive(`@key(fields: "id")`)
export class ExampleEntity implements ExampleInterface {
  static nodeName = 'Example';
  @Field(() => ID, { nullable: false })
  id?: string;

  @Field(() => String, { nullable: true })
  createdBy?: string;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
  })
  createdAt?: Date;

  @Field(() => Number, {
    nullable: true,
  })
  number?: number;

  constructor(partial: any) {
    Object.assign(this, partial);
    if (!this.createdAt) {
      this.createdAt = new Date();
    } else {
      this.createdAt = new Date(this.createdAt);
    }
  }

  /**
   * only attributes
   */

  lean(): ExampleInterface {
    return {
      id: this.id,
      createdAt: this.createdAt,
      createdBy: this.createdBy,
    };
  }

  toNode() {
    return {
      createdAt: this.createdAt.toISOString(),
      createdBy: this.createdBy,
    };
  }
  toUpdateInput() {
    return {
      createdAt: this.createdAt.toISOString(),
      createdBy: this.createdBy,
    };
  }

  toCreateInput() {
    return pickBy({
      createdAt: this.createdAt.toISOString(),
      createdBy: this.createdBy,
      number: this.number,
    });
  }
}

@ObjectType({ description: 'Type of example entity list response' })
export class ManyExample {
  @Field(() => [ExampleEntity], { defaultValue: [] })
  data: Array<ExampleEntity>;

  @Field({ nullable: true })
  paging: PagingEntity;
}

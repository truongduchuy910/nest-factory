/**
 * 📌 MONGO ARGS
 */

import {
  ArgsType,
  Field,
  InputType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { Types } from 'mongoose';
import { isEmpty, pickBy } from 'lodash';
import { PagingInput } from 'nest-mopa';
import { MongoEntity } from './mongo.entity';

@InputType({ description: 'Mongo Public InputType' })
export class MongoInputType extends PartialType(
  PickType(MongoEntity, ['id', 'string', 'date', 'number'] as const),
  InputType,
) {}

@InputType({ description: 'Mongo create Public InputType.' })
export class MongoCreateInputType extends PartialType(
  PickType(MongoInputType, ['string', 'date', 'number'] as const),
  InputType,
) {}

@InputType({ description: 'Mongo where Public InputType' })
export class MongoWhereInputType extends PartialType(
  PickType(MongoInputType, ['id', 'string', 'date', 'number'] as const),
  InputType,
) {
  /**
   * convert to mongo filter
   */
  static toFilter(where: MongoWhereInputType | undefined) {
    const filter = {} as any;
    if (where?.id) {
      filter._id = new Types.ObjectId(where.id);
    }
    return pickBy(filter);
  }

  static toSort(key: string) {
    const map = {
      string_ASC: {
        key: 'string',
        keyBuilder: (value: any) => `${value}`,
        keyOrder: 1,
      },
      string_DESC: {
        key: 'string',
        keyBuilder: (value: any) => `${value}`,
        keyOrder: -1,
      },
      number_ASC: {
        key: 'number',
        keyBuilder: (value: any) => Number(value),
        keyOrder: 1,
      },
      number_DESC: {
        key: 'number',
        keyBuilder: (value: any) => Number(value),
        keyOrder: -1,
      },
      date_ASC: {
        key: 'date',
        keyBuilder: (value: any) => new Date(value),
        keyOrder: 1,
      },
      date_DESC: {
        key: 'date',
        keyBuilder: (value: any) => new Date(value),
        keyOrder: -1,
      },
    };
    return map[key] || {};
  }
}

@InputType({ description: 'Mongo index Public InputType' })
export class MongoIndexInputType extends PartialType(
  PickType(MongoEntity, ['id'] as const),
  InputType,
) {
  /**
   * convert to mongo filter
   */
  static toFilter(index: MongoIndexInputType | undefined) {
    const filter = {} as any;
    if (index?.id) {
      filter._id = new Types.ObjectId(index.id);
    }

    const resolvedData = pickBy(filter);
    if (isEmpty(resolvedData)) {
      throw new Error('MongoIndexInputType cannot empty');
    }
    return resolvedData;
  }
}

/**
 * ARGUMENTS
 */

@ArgsType()
export class CreateOneMongoArgs {
  @Field()
  data: MongoCreateInputType;
}

@ArgsType()
export class FindOneMongoArgs {
  @Field()
  index: MongoIndexInputType;
}

@ArgsType()
export class FindManyMongoArgs {
  @Field({ nullable: true })
  where?: MongoWhereInputType;

  @Field({ nullable: true })
  paging?: PagingInput;

  @Field({ nullable: true })
  sortBy?: string;

  @Field({ nullable: true })
  search?: string;
}

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
import { isEmpty, merge, pickBy } from 'lodash';
import { PagingInput } from 'nest-gfc';
import { MongoEntity } from './mongo.entity';
import { Paging } from 'nest-mopa';

@InputType({ description: 'Mongo Public InputType' })
export class MongoInputType extends PartialType(
  PickType(MongoEntity, [
    'id',
    'label',
    'string',
    'date',
    'number',
    'duplicate',
  ] as const),
  InputType,
) {}

@InputType({ description: 'Mongo create Public InputType.' })
export class MongoUpdateInputType extends PartialType(
  PickType(MongoInputType, [
    'id',
    'label',
    'string',
    'date',
    'number',
    'duplicate',
  ] as const),
  InputType,
) {
  static toUpdateInput(data: MongoCreateInputType) {
    const result = {};
    delete data.id;
    return merge(result, data);
  }
}

@InputType({ description: 'Mongo create Public InputType.' })
export class MongoCreateInputType extends PartialType(
  PickType(MongoInputType, [
    'id',
    'label',
    'string',
    'date',
    'number',
    'duplicate',
  ] as const),
  InputType,
) {
  static toCreateInput(data: MongoCreateInputType) {
    const result = { _id: new Types.ObjectId(data.id) };
    delete data.id;
    return merge(result, data);
  }
}

@InputType({ description: 'Mongo where Public InputType' })
export class MongoWhereInputType extends PartialType(
  PickType(MongoInputType, [
    'id',
    'label',
    'string',
    'date',
    'number',
    'duplicate',
  ] as const),
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
        keyBuilder: (value: any) => String(value),
        keyOrder: Paging.ASC,
      },
      string_DESC: {
        key: 'string',
        keyBuilder: (value: any) => String(value),
        keyOrder: Paging.DESC,
      },
      number_ASC: {
        key: 'number',
        keyBuilder: (value: any) => Number(value),
        keyOrder: Paging.ASC,
      },
      number_DESC: {
        key: 'number',
        keyBuilder: (value: any) => Number(value),
        keyOrder: Paging.DESC,
      },
      date_ASC: {
        key: 'date',
        keyBuilder: (value: any) => new Date(value),
        keyOrder: Paging.ASC,
      },
      date_DESC: {
        key: 'date',
        keyBuilder: (value: any) => new Date(value),
        keyOrder: Paging.DESC,
      },
      duplicate_ASC: {
        key: 'duplicate',
        keyBuilder: (value: any) => Number(value),
        keyOrder: Paging.ASC,
      },
      duplicate_DESC: {
        key: 'duplicate',
        keyBuilder: (value: any) => Number(value),
        keyOrder: Paging.DESC,
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
export class UpdateOneMongoArgs {
  @Field()
  data: MongoUpdateInputType;

  @Field()
  index: MongoIndexInputType;

  static convert(args: UpdateOneMongoArgs) {
    const filter = MongoIndexInputType.toFilter(args.index);
    const input = MongoUpdateInputType.toUpdateInput(args.data);
    return { filter, input };
  }
}

@ArgsType()
export class CreateManyMongoArgs {
  @Field(() => [MongoCreateInputType])
  data: MongoCreateInputType[];

  static convert(args: CreateManyMongoArgs) {
    const input = args.data.map(MongoCreateInputType.toCreateInput);
    return { input };
  }
}

@ArgsType()
export class CreateOneMongoArgs {
  @Field()
  data: MongoCreateInputType;

  static convert(args: CreateOneMongoArgs) {
    const input = MongoCreateInputType.toCreateInput(args.data);
    return { input };
  }
}

@ArgsType()
export class FindOneMongoArgs {
  @Field()
  index: MongoIndexInputType;

  @Field({ nullable: true })
  label?: string;

  static convert(args: FindOneMongoArgs) {
    const filter = MongoIndexInputType.toFilter(args.index);
    return { filter };
  }
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

  static convert(args: FindManyMongoArgs) {
    const filter = MongoWhereInputType.toFilter(args.where);
    const sort = MongoWhereInputType.toSort(args.sortBy);
    return { ...args, filter, sort };
  }
}

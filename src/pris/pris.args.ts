/**
 * 📌 PRIS ARGS
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
import { PrisEntity } from './pris.entity';

@InputType({ description: 'Pris Public InputType' })
export class PrisInputType extends PartialType(
  PickType(PrisEntity, ['id', 'string', 'date', 'number'] as const),
  InputType,
) {}

@InputType({ description: 'Pris create Public InputType.' })
export class PrisUpdateInputType extends PartialType(
  PickType(PrisInputType, ['id', 'string', 'date', 'number'] as const),
  InputType,
) {
  static toUpdateInput(data: PrisCreateInputType) {
    const result = {};
    delete data.id;
    return merge(result, data);
  }
}

@InputType({ description: 'Pris create Public InputType.' })
export class PrisCreateInputType extends PartialType(
  PickType(PrisInputType, ['id', 'string', 'date', 'number'] as const),
  InputType,
) {
  static toCreateInput(data: PrisCreateInputType) {
    const result = { _id: new Types.ObjectId(data.id) };
    delete data.id;
    return merge(result, data);
  }
}

@InputType({ description: 'Pris where Public InputType' })
export class PrisWhereInputType extends PartialType(
  PickType(PrisInputType, ['id', 'string', 'date', 'number'] as const),
  InputType,
) {
  /**
   * convert to mongo filter
   */
  static toFilter(where: PrisWhereInputType | undefined) {
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

@InputType({ description: 'Pris index Public InputType' })
export class PrisIndexInputType extends PartialType(
  PickType(PrisEntity, ['id'] as const),
  InputType,
) {
  /**
   * convert to mongo filter
   */
  static toFilter(index: PrisIndexInputType | undefined) {
    const filter = {} as any;
    if (index?.id) {
      filter._id = new Types.ObjectId(index.id);
    }

    const resolvedData = pickBy(filter);
    if (isEmpty(resolvedData)) {
      throw new Error('PrisIndexInputType cannot empty');
    }
    return resolvedData;
  }
}

/**
 * ARGUMENTS
 */

@ArgsType()
export class UpdateOnePrisArgs {
  @Field()
  data: PrisUpdateInputType;

  @Field()
  index: PrisIndexInputType;

  static convert(args: UpdateOnePrisArgs) {
    const filter = PrisIndexInputType.toFilter(args.index);
    const input = PrisUpdateInputType.toUpdateInput(args.data);
    return { filter, input };
  }
}

@ArgsType()
export class CreateOnePrisArgs {
  @Field()
  data: PrisCreateInputType;

  static convert(args: CreateOnePrisArgs) {
    const input = PrisCreateInputType.toCreateInput(args.data);
    return { input };
  }
}

@ArgsType()
export class FindOnePrisArgs {
  @Field()
  index: PrisIndexInputType;

  @Field({ nullable: true })
  label?: string;

  static convert(args: FindOnePrisArgs) {
    const filter = PrisIndexInputType.toFilter(args.index);
    return { filter };
  }
}

@ArgsType()
export class FindManyPrisArgs {
  @Field({ nullable: true })
  where?: PrisWhereInputType;

  @Field({ nullable: true })
  paging?: PagingInput;

  @Field({ nullable: true })
  sortBy?: string;

  @Field({ nullable: true })
  search?: string;

  static convert(args: FindManyPrisArgs) {
    const filter = PrisWhereInputType.toFilter(args.where);
    const sort = PrisWhereInputType.toSort(args.sortBy);
    return { ...args, filter, sort };
  }
}

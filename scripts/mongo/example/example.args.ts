/**
 * 📌 EXAMPLE ARGS
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
import { ExampleEntity } from './example.entity';
import { Paging } from 'nest-mopa';

@InputType({ description: 'Example Public InputType' })
export class ExampleInputType extends PartialType(
  PickType(ExampleEntity, [
    'id',
    'label',
    'string',
    'date',
    'number',
    'duplicate',
  ] as const),
  InputType,
) {}

@InputType({ description: 'Example create Public InputType.' })
export class ExampleUpdateInputType extends PartialType(
  PickType(ExampleInputType, [
    'id',
    'label',
    'string',
    'date',
    'number',
    'duplicate',
  ] as const),
  InputType,
) {
  static toUpdateInput(data: ExampleCreateInputType) {
    const result = {};
    delete data.id;
    return merge(result, data);
  }
}

@InputType({ description: 'Example create Public InputType.' })
export class ExampleCreateInputType extends PartialType(
  PickType(ExampleInputType, [
    'id',
    'label',
    'string',
    'date',
    'number',
    'duplicate',
  ] as const),
  InputType,
) {
  static toCreateInput(data: ExampleCreateInputType) {
    const result = { _id: new Types.ObjectId(data.id) };
    delete data.id;
    return merge(result, data);
  }
}

@InputType({ description: 'Example where Public InputType' })
export class ExampleWhereInputType extends PartialType(
  PickType(ExampleInputType, [
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
  static toFilter(where: ExampleWhereInputType | undefined) {
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

@InputType({ description: 'Example index Public InputType' })
export class ExampleIndexInputType extends PartialType(
  PickType(ExampleEntity, ['id'] as const),
  InputType,
) {
  /**
   * convert to mongo filter
   */
  static toFilter(index: ExampleIndexInputType | undefined) {
    const filter = {} as any;
    if (index?.id) {
      filter._id = new Types.ObjectId(index.id);
    }

    const resolvedData = pickBy(filter);
    if (isEmpty(resolvedData)) {
      throw new Error('ExampleIndexInputType cannot empty');
    }
    return resolvedData;
  }
}

/**
 * ARGUMENTS
 */

@ArgsType()
export class UpdateOneExampleArgs {
  @Field()
  data: ExampleUpdateInputType;

  @Field()
  index: ExampleIndexInputType;

  static convert(args: UpdateOneExampleArgs) {
    const filter = ExampleIndexInputType.toFilter(args.index);
    const input = ExampleUpdateInputType.toUpdateInput(args.data);
    return { filter, input };
  }
}

@ArgsType()
export class CreateManyExampleArgs {
  @Field(() => [ExampleCreateInputType])
  data: ExampleCreateInputType[];

  static convert(args: CreateManyExampleArgs) {
    const input = args.data.map(ExampleCreateInputType.toCreateInput);
    return { input };
  }
}

@ArgsType()
export class CreateOneExampleArgs {
  @Field()
  data: ExampleCreateInputType;

  static convert(args: CreateOneExampleArgs) {
    const input = ExampleCreateInputType.toCreateInput(args.data);
    return { input };
  }
}

@ArgsType()
export class FindOneExampleArgs {
  @Field()
  index: ExampleIndexInputType;

  @Field({ nullable: true })
  label?: string;

  static convert(args: FindOneExampleArgs) {
    const filter = ExampleIndexInputType.toFilter(args.index);
    return { filter };
  }
}

@ArgsType()
export class FindManyExampleArgs {
  @Field({ nullable: true })
  where?: ExampleWhereInputType;

  @Field({ nullable: true })
  paging?: PagingInput;

  @Field({ nullable: true })
  sortBy?: string;

  @Field({ nullable: true })
  search?: string;

  static convert(args: FindManyExampleArgs) {
    const filter = ExampleWhereInputType.toFilter(args.where);
    const sort = ExampleWhereInputType.toSort(args.sortBy);
    return { ...args, filter, sort };
  }
}

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
import { merge, pickBy } from 'lodash';
import { PagingInput } from 'nest-gfc';
import { ExampleEntity } from './example.entity';
import { Prisma } from '@prisma/client';

@InputType({ description: 'Example Public InputType' })
export class ExampleInputType extends PartialType(
  PickType(ExampleEntity, [
    'id',
    'string',
    'date',
    'number',
    'duplicate',
    'created_at',
    'label',
  ] as const),
  InputType,
) { }

@InputType({ description: 'Example create Public InputType.' })
export class ExampleUpdateInputType extends PartialType(
  PickType(ExampleInputType, [
    'id',
    'string',
    'date',
    'number',
    'duplicate',
    'created_at',
    'label',
  ] as const),
  InputType,
) {
  static toUpdateInput(data: ExampleUpdateInputType) {
    const result = {
      id: data?.id && Number(data.id),
      number: data?.number && Number(data.number),
    };
    delete data.id;
    const merged = merge(data, result);

    return pickBy(merged) as Prisma.exampleUpdateInput;
  }
}

@InputType({ description: 'Example create Public InputType.' })
export class ExampleCreateInputType extends PartialType(
  PickType(ExampleInputType, [
    'string',
    'date',
    'number',
    'duplicate',
    'created_at',
    'label',
  ] as const),
  InputType,
) {
  static toCreateInput(data: ExampleCreateInputType) {
    const result = {
      created_at: new Date(),
    };
    const merged = merge(data, result);

    return pickBy(merged) as Prisma.exampleCreateInput;
  }
}

@InputType({ description: 'Example where Public InputType' })
export class ExampleWhereInputType extends PartialType(
  PickType(ExampleInputType, [
    'id',
    'string',
    'date',
    'number',
    'duplicate',
    'created_at',
    'label',
  ] as const),
  InputType,
) {
  static toFilter(where: ExampleWhereInputType | undefined) {
    const result = {
      id: where?.id && Number(where.id),
    };
    const merged = merge(where, result);
    return pickBy(merged) as Prisma.exampleWhereInput;
  }

  static toSort(key: string) {
    const map = {
      string_ASC: {
        key: 'string',
        keyBuilder: (value: any) => String(value),
        keyOrder: 'asc',
      },
      string_DESC: {
        key: 'string',
        keyBuilder: (value: any) => String(value),
        keyOrder: 'desc',
      },
      number_ASC: {
        key: 'number',
        keyBuilder: (value: any) => Number(value),
        keyOrder: 'asc',
      },
      number_DESC: {
        key: 'number',
        keyBuilder: (value: any) => Number(value),
        keyOrder: 'desc',
      },
      date_ASC: {
        key: 'date',
        keyBuilder: (value: any) => new Date(value),
        keyOrder: 'asc',
      },
      date_DESC: {
        key: 'date',
        keyBuilder: (value: any) => new Date(value),
        keyOrder: 'desc',
      },
      duplicate_ASC: {
        key: 'duplicate',
        keyBuilder: (value: any) => Number(value),
        keyOrder: 'asc',
      },
      duplicate_DESC: {
        key: 'duplicate',
        keyBuilder: (value: any) => Number(value),
        keyOrder: 'desc',
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
  static toFilter(index: ExampleIndexInputType | undefined) {
    const filter = { id: Number(index.id) };
    const merged = merge(index, filter);
    return pickBy(merged) as Prisma.exampleWhereUniqueInput;
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
    const merged = merge(args, { filter, sort });

    return pickBy(merged);
  }
}

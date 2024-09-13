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
import { PagingInput } from 'nest-gfc';
import { isEmpty, pickBy } from 'lodash';

import { ExampleEntity } from './example.entity';

@InputType({ description: 'example entity general input' })
export class ExampleInputType extends PartialType(
  PickType(ExampleEntity, [
    'id',
    'createdBy',
    'createdAt',
    'number',
    'string',
    'date',
  ] as const),
  InputType,
) {}

@InputType({ description: 'example entity create input' })
export class ExampleCreateInputType extends PartialType(
  PickType(ExampleInputType, [
    'createdBy',
    'createdAt',
    'number',
    'string',
    'date',
  ] as const),
  InputType,
) {
  static toCreateInput(data: ExampleCreateInputType) {
    return pickBy({
      createdAt: data.createdAt,
      createdBy: data.createdBy,
      number: data.number,
      string: data.string,
      date: data.date.toISOString(),
    });
  }
}

@InputType({ description: 'example entity update input' })
export class ExampleUpdateInputType extends PartialType(
  PickType(ExampleInputType, ['number', 'string', 'date'] as const),
  InputType,
) {
  static toUpdateInput(data: ExampleCreateInputType) {
    return {
      createdAt: data.createdAt && data.createdAt.toISOString(),
      createdBy: data.createdBy,
      number: data.number,
      string: data.string,
      date: data.date && data.date.toISOString(),
    };
  }
}

@InputType({ description: 'example entity where input' })
export class ExampleWhereInputType extends PartialType(
  PickType(ExampleInputType, ['id'] as const),
  InputType,
) {
  /**
   * convert to neo4j filter
   */
  static toFilter(where: ExampleWhereInputType | undefined) {
    const filter = {} as any;
    if (where?.id) {
      filter.id = where.id;
    }
    return pickBy(filter);
  }

  static toSort(key: string) {
    const map = {
      createdBy_ASC: {
        key: 'createdBy',
        keyBuilder: (value: any) => `${value}`,
        keyOrder: 'ASC',
      },
      createdBy_DESC: {
        key: 'createdBy',
        keyBuilder: (value: any) => `${value}`,
        keyOrder: 'DESC',
      },
      number_ASC: {
        key: 'number',
        keyBuilder: (value: any) => Number(value),
        keyOrder: 'ASC',
      },
      number_DESC: {
        key: 'number',
        keyBuilder: (value: any) => Number(value),
        keyOrder: 'DESC',
      },
      createdAt_ASC: {
        key: 'createdAt',
        keyBuilder: (value: any) => `${value}`,
        keyOrder: 'ASC',
      },
      createdAt_DESC: {
        key: 'createdAt',
        keyBuilder: (value: any) => `${value}`,
        keyOrder: 'DESC',
      },
    };
    return map[key] || {};
  }
}

@InputType({ description: 'example entity index input' })
export class ExampleIndexInputType extends PartialType(
  PickType(ExampleInputType, ['id'] as const),
  InputType,
) {
  static toFilter(index: ExampleIndexInputType | undefined) {
    let filter: any = {};
    if (index?.id) {
      filter.id = index.id;
    }

    const resolvedData = pickBy(filter);
    if (isEmpty(resolvedData)) {
      throw new Error('ExampleIndexInput cannot empty');
    }
    return resolvedData;
  }
}

/**
 * ARGUMENTS
 */
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
  where: ExampleWhereInputType;

  @Field({ nullable: true })
  paging: PagingInput;

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
export class UpdateOneExampleArgs {
  @Field()
  index: ExampleIndexInputType;

  @Field()
  data: ExampleUpdateInputType;

  static convert(args: UpdateOneExampleArgs) {
    const filter = ExampleIndexInputType.toFilter(args.index);
    const input = ExampleUpdateInputType.toUpdateInput(args.data);
    return { filter, input };
  }
}

@ArgsType()
export class DeleteOneExampleArgs {
  @Field()
  index: ExampleIndexInputType;
}

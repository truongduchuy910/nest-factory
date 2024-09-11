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
import { PagingInput } from 'nest-nepa';
import { isEmpty, pickBy } from 'lodash';

import { ExampleEntity } from './example.entity';

@InputType({ description: 'example entity general input' })
export class ExampleInputType extends PartialType(
  PickType(ExampleEntity, ['id', 'createdBy', 'createdAt', 'number'] as const),
  InputType,
) {}

@InputType({ description: 'example entity create input' })
export class ExampleCreateInputType extends PartialType(
  PickType(ExampleInputType, ['createdBy', 'createdAt', 'number'] as const),
  InputType,
) {}

@InputType({ description: 'example entity update input' })
export class ExampleUpdateInput extends PartialType(
  PickType(ExampleInputType, ['number'] as const),
  InputType,
) {}

@InputType({ description: 'example entity where input' })
export class ExampleWhereInput extends PartialType(
  PickType(ExampleInputType, ['id'] as const),
  InputType,
) {
  /**
   * convert to neo4j filter
   */
  static toFilter(where: ExampleWhereInput | undefined) {
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
export class ExampleIndexInput extends PartialType(
  PickType(ExampleInputType, ['id'] as const),
  InputType,
) {
  static toFilter(index: ExampleIndexInput | undefined) {
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
  index: ExampleIndexInput;
}

@ArgsType()
export class FindManyExampleArgs {
  @Field({ nullable: true })
  where: ExampleWhereInput;

  @Field({ nullable: true })
  paging: PagingInput;

  @Field({ nullable: true })
  sortBy?: string;

  @Field({ nullable: true })
  search?: string;
}

@ArgsType()
export class CreateOneExampleArgs {
  @Field()
  data: ExampleCreateInputType;
}

@ArgsType()
export class UpdateOneExampleArgs {
  @Field()
  index: ExampleIndexInput;

  @Field()
  data: ExampleUpdateInput;
}

@ArgsType()
export class DeleteOneExampleArgs {
  @Field()
  index: ExampleIndexInput;
}

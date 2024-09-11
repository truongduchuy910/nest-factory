/**
 * 📌 NEO ARGS
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

import { NeoEntity } from './neo.entity';

@InputType({ description: 'neo entity general input' })
export class NeoInputType extends PartialType(
  PickType(NeoEntity, ['id', 'createdBy', 'createdAt', 'number'] as const),
  InputType,
) {}

@InputType({ description: 'neo entity create input' })
export class NeoCreateInputType extends PartialType(
  PickType(NeoInputType, ['createdBy', 'createdAt', 'number'] as const),
  InputType,
) {}

@InputType({ description: 'neo entity update input' })
export class NeoUpdateInput extends PartialType(
  PickType(NeoInputType, ['number'] as const),
  InputType,
) {}

@InputType({ description: 'neo entity where input' })
export class NeoWhereInput extends PartialType(
  PickType(NeoInputType, ['id'] as const),
  InputType,
) {
  /**
   * convert to neo4j filter
   */
  static toFilter(where: NeoWhereInput | undefined) {
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

@InputType({ description: 'neo entity index input' })
export class NeoIndexInput extends PartialType(
  PickType(NeoInputType, ['id'] as const),
  InputType,
) {
  static toFilter(index: NeoIndexInput | undefined) {
    let filter: any = {};
    if (index?.id) {
      filter.id = index.id;
    }

    const resolvedData = pickBy(filter);
    if (isEmpty(resolvedData)) {
      throw new Error('NeoIndexInput cannot empty');
    }
    return resolvedData;
  }
}

/**
 * ARGUMENTS
 */

@ArgsType()
export class FindOneNeoArgs {
  @Field()
  index: NeoIndexInput;
}

@ArgsType()
export class FindManyNeoArgs {
  @Field({ nullable: true })
  where: NeoWhereInput;

  @Field({ nullable: true })
  paging: PagingInput;

  @Field({ nullable: true })
  sortBy?: string;

  @Field({ nullable: true })
  search?: string;
}

@ArgsType()
export class CreateOneNeoArgs {
  @Field()
  data: NeoCreateInputType;
}

@ArgsType()
export class UpdateOneNeoArgs {
  @Field()
  index: NeoIndexInput;

  @Field()
  data: NeoUpdateInput;
}

@ArgsType()
export class DeleteOneNeoArgs {
  @Field()
  index: NeoIndexInput;
}

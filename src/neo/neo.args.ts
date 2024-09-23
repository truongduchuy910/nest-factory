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
import { PagingInput } from 'nest-gfc';
import { isEmpty, merge, pickBy } from 'lodash';

import { NeoEntity } from './neo.entity';
import { Paging } from 'nest-nepa';

@InputType({ description: 'neo entity general input' })
export class NeoInputType extends PartialType(
  PickType(NeoEntity, [
    'id',
    'createdBy',
    'createdAt',
    'number',
    'string',
    'date',
    'label',
  ] as const),
  InputType,
) {}

@InputType({ description: 'neo entity create input' })
export class NeoCreateInputType extends PartialType(
  PickType(NeoInputType, [
    'createdBy',
    'createdAt',
    'number',
    'string',
    'date',
    'label',
  ] as const),
  InputType,
) {
  static toCreateInput(data: NeoCreateInputType) {
    const input = {
      date: data?.date && new Date(data.date).toISOString(),
    };
    return merge(data, input);
  }
}

@InputType({ description: 'neo entity update input' })
export class NeoUpdateInputType extends PartialType(
  PickType(NeoInputType, ['number', 'string', 'date', 'label'] as const),
  InputType,
) {
  static toUpdateInput(data: NeoCreateInputType) {
    const input = pickBy({
      date: data?.date && new Date(data.date),
    });
    return merge(data, input);
  }
}

@InputType({ description: 'neo entity where input' })
export class NeoWhereInputType extends PartialType(
  PickType(NeoInputType, ['id', 'label'] as const),
  InputType,
) {
  /**
   * convert to neo4j filter
   */
  static toFilter(where: NeoWhereInputType | undefined) {
    const filter = {} as any;
    return merge(where, filter);
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
      date_ASC: {
        key: 'date',
        keyBuilder: (value: any) => new Date(value).toISOString(),
        keyOrder: Paging.ASC,
      },
      date_DESC: {
        key: 'date',
        keyBuilder: (value: any) => new Date(value).toISOString(),
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

@InputType({ description: 'neo entity index input' })
export class NeoIndexInputType extends PartialType(
  PickType(NeoInputType, ['id'] as const),
  InputType,
) {
  static toFilter(index: NeoIndexInputType | undefined) {
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
  index: NeoIndexInputType;

  @Field({ nullable: true })
  label?: string;

  static convert(args: FindOneNeoArgs) {
    const filter = NeoIndexInputType.toFilter(args.index);
    return { filter };
  }
}

@ArgsType()
export class FindManyNeoArgs {
  @Field({ nullable: true })
  where: NeoWhereInputType;

  @Field({ nullable: true })
  paging: PagingInput;

  @Field({ nullable: true })
  sortBy?: string;

  @Field({ nullable: true })
  search?: string;

  static convert(args: FindManyNeoArgs) {
    const filter = NeoWhereInputType.toFilter(args.where);
    const sort = NeoWhereInputType.toSort(args.sortBy);
    return { ...args, filter, sort };
  }
}

@ArgsType()
export class CreateManyNeoArgs {
  @Field(() => [NeoCreateInputType])
  data: NeoCreateInputType[];

  static convert(args: CreateManyNeoArgs) {
    const input = args.data.map(NeoCreateInputType.toCreateInput);
    return { input };
  }
}

@ArgsType()
export class CreateOneNeoArgs {
  @Field()
  data: NeoCreateInputType;

  static convert(args: CreateOneNeoArgs) {
    const input = NeoCreateInputType.toCreateInput(args.data);
    return { input };
  }
}

@ArgsType()
export class UpdateOneNeoArgs {
  @Field()
  index: NeoIndexInputType;

  @Field()
  data: NeoUpdateInputType;

  static convert(args: UpdateOneNeoArgs) {
    const filter = NeoIndexInputType.toFilter(args.index);
    const input = NeoUpdateInputType.toUpdateInput(args.data);
    return { filter, input };
  }
}

@ArgsType()
export class DeleteOneNeoArgs {
  @Field()
  index: NeoIndexInputType;

  static convert(args: DeleteOneNeoArgs) {
    const filter = NeoIndexInputType.toFilter(args.index);
    return { filter };
  }
}

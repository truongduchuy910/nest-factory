/**
 * 📌 NEO_4_J ARGS
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

import { Neo4jEntity } from './neo4j.entity';

@InputType({ description: 'neo4j entity general input' })
export class Neo4jInputType extends PartialType(
  PickType(Neo4jEntity, ['id', 'createdBy', 'createdAt', 'number'] as const),
  InputType,
) {}

@InputType({ description: 'neo4j entity create input' })
export class Neo4jCreateInputType extends PartialType(
  PickType(Neo4jInputType, ['createdBy', 'createdAt', 'number'] as const),
  InputType,
) {}

@InputType({ description: 'neo4j entity update input' })
export class Neo4jUpdateInput extends PartialType(
  PickType(Neo4jInputType, ['number'] as const),
  InputType,
) {}

@InputType({ description: 'neo4j entity where input' })
export class Neo4jWhereInput extends PartialType(
  PickType(Neo4jInputType, ['id'] as const),
  InputType,
) {
  /**
   * convert to neo4j filter
   */
  static toFilter(where: Neo4jWhereInput | undefined) {
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

@InputType({ description: 'neo4j entity index input' })
export class Neo4jIndexInput extends PartialType(
  PickType(Neo4jInputType, ['id'] as const),
  InputType,
) {
  static toFilter(index: Neo4jIndexInput | undefined) {
    let filter: any = {};
    if (index?.id) {
      filter.id = index.id;
    }

    const resolvedData = pickBy(filter);
    if (isEmpty(resolvedData)) {
      throw new Error('Neo4jIndexInput cannot empty');
    }
    return resolvedData;
  }
}

/**
 * ARGUMENTS
 */

@ArgsType()
export class FindOneNeo4jArgs {
  @Field()
  index: Neo4jIndexInput;
}

@ArgsType()
export class FindManyNeo4jArgs {
  @Field({ nullable: true })
  where: Neo4jWhereInput;

  @Field({ nullable: true })
  paging: PagingInput;

  @Field({ nullable: true })
  sortBy?: string;

  @Field({ nullable: true })
  search?: string;
}

@ArgsType()
export class CreateOneNeo4jArgs {
  @Field()
  data: Neo4jCreateInputType;
}

@ArgsType()
export class UpdateOneNeo4jArgs {
  @Field()
  index: Neo4jIndexInput;

  @Field()
  data: Neo4jUpdateInput;
}

@ArgsType()
export class DeleteOneNeo4jArgs {
  @Field()
  index: Neo4jIndexInput;
}

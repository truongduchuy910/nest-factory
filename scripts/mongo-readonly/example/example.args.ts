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
import { isEmpty, pickBy } from 'lodash';
import { PagingInput } from 'nest-mopa';
import { ExampleEntity } from './example.entity';

@InputType({ description: 'Example Public InputType' })
export class ExampleInputType extends PartialType(
  PickType(ExampleEntity, ['id', 'string', 'date', 'number'] as const),
  InputType,
) {}

@InputType({ description: 'Example where Public InputType' })
export class ExampleWhereInputType extends PartialType(
  PickType(ExampleInputType, ['id', 'string', 'date', 'number'] as const),
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
export class FindOneExampleArgs {
  @Field()
  index: ExampleIndexInputType;
}

@ArgsType()
export class FindManyExampleArgs {
  @Field({ nullable: true })
  where: ExampleWhereInputType;

  @Field({ nullable: true })
  paging: PagingInput;
}

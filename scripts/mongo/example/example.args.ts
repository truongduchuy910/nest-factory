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
import { ExampleEntity } from './example.entity';
import { Types } from 'mongoose';
import { isEmpty, pickBy } from 'lodash';
import { PagingInput } from 'nemopa';

@InputType({ description: 'Example Public InputType' })
export class ExampleInput extends PartialType(
  PickType(ExampleEntity, ['id', 'label'] as const),
  InputType,
) {}

@InputType({ description: 'Example create Public InputType.' })
export class ExampleCreateInputType extends PartialType(
  PickType(ExampleInput, ['label'] as const),
  InputType,
) {}

@InputType({ description: 'Example update Public InputType.' })
export class ExampleUpdateInputType extends PartialType(
  PickType(ExampleInput, ['label'] as const),
  InputType,
) {}

@InputType({ description: 'Example where Public InputType' })
export class ExampleWhereInputType extends PartialType(
  PickType(ExampleInput, ['id'] as const),
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
export class ExampleIndexInput extends PartialType(
  PickType(ExampleEntity, ['id'] as const),
  InputType,
) {
  static toFilter(index: ExampleIndexInput | undefined) {
    const filter = {} as any;
    if (index?.id) {
      filter._id = new Types.ObjectId(index.id);
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
  where: ExampleWhereInputType;

  @Field({ nullable: true })
  paging: PagingInput;
}

@ArgsType()
export class CreateOneExample {
  @Field()
  data: ExampleCreateInputType;
}

@ArgsType()
export class UpdateOneExampleArgs {
  @Field()
  index: ExampleIndexInput;

  @Field()
  data: ExampleUpdateInputType;
}

@ArgsType()
export class DeleteOneExampleArgs {
  @Field()
  index: ExampleIndexInput;
}

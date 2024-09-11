/**
 * 📌 EXAMPLE RESOLVER
 */

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Logger, UseGuards } from '@nestjs/common';
import { Model } from 'mongoose';

import { ExampleEntity, ManyExampleEntity } from './example.entity';
import {
  CreateOneExample,
  DeleteOneExampleArgs,
  ExampleIndexInput,
  ExampleWhereInputType,
  FindManyExampleArgs,
  FindOneExampleArgs,
  UpdateOneExampleArgs,
} from './example.args';
import { ExampleService } from './example.service';
import { ExampleDocument } from './example.schema';
import { GqlIAMGuard } from 'src/guard/iam.guard';
import { GqlThrottlerGuard } from 'src/guard/throttler.guard';

@Resolver(() => ExampleEntity)
export class ExampleResolver {
  private readonly logger = new Logger(ExampleResolver.name);

  model: Model<ExampleDocument>;

  constructor(private readonly service: ExampleService) {
    this.model = this.service.getModel();
  }

  @UseGuards(GqlThrottlerGuard, GqlIAMGuard)
  @Mutation(() => ExampleEntity, { nullable: true })
  async createOneExample(@Args() args: CreateOneExample) {
    const created = await this.model.create(args.data);
    return created;
  }

  @UseGuards(GqlThrottlerGuard, GqlIAMGuard)
  @Query(() => ExampleEntity, { nullable: true })
  async findOneExample(@Args() args: FindOneExampleArgs) {
    const { index } = args;
    const filter = ExampleIndexInput.toFilter(index);
    const one = await this.model.findOne(filter);
    return one;
  }

  @UseGuards(GqlThrottlerGuard, GqlIAMGuard)
  @Query(() => ManyExampleEntity, { nullable: true })
  async findManyExample(@Args() args: FindManyExampleArgs) {
    const { where } = args;
    const filter = ExampleWhereInputType.toFilter(where);
    const many = await this.service.findMany({
      filter,
      paging: args.paging,
    });
    return many;
  }

  @UseGuards(GqlThrottlerGuard, GqlIAMGuard)
  @Mutation(() => ExampleEntity, { nullable: true })
  async updateOneExample(@Args() args: UpdateOneExampleArgs) {
    const { index } = args;
    const filter = ExampleIndexInput.toFilter(index);
    const updated = await this.model.findOneAndUpdate(filter, args.data, {
      new: true,
    });
    return updated;
  }

  @UseGuards(GqlThrottlerGuard, GqlIAMGuard)
  @Mutation(() => ExampleEntity, { nullable: true })
  async deleteOneExample(@Args() args: DeleteOneExampleArgs) {
    this.logger.debug(`deleteOneExample ${args?.index?.id}`);
    const { index } = args;
    const filter = ExampleIndexInput.toFilter(index);
    const deleted = await this.model.findOneAndDelete(filter);
    return deleted;
  }
}

/**
 * 📌 EXAMPLE RESOLVER
 */

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { Model } from 'mongoose';

import { ExampleEntity, ManyExampleEntity } from './example.entity';
import {
  CreateOneExampleArgs,
  ExampleIndexInputType,
  ExampleWhereInputType,
  FindManyExampleArgs,
  FindOneExampleArgs,
} from './example.args';
import { ExampleService } from './example.service';
import { ExampleDocument } from './example.schema';

@Resolver(() => ExampleEntity)
export class ExampleResolver {
  readonly logger = new Logger(ExampleResolver.name);

  model: Model<ExampleDocument>;

  constructor(private readonly service: ExampleService) {
    this.model = this.service.getModel();
  }

  @Mutation(() => ExampleEntity, { nullable: true })
  async createOneExample(@Args() args: CreateOneExampleArgs) {
    const created = await this.model.create(args.data);
    return created;
  }

  @Query(() => ExampleEntity, {
    nullable: true,
    description: 'find one example',
  })
  async findOneExample(@Args() args: FindOneExampleArgs) {
    const { index } = args;
    const filter = ExampleIndexInputType.toFilter(index);
    const one = await this.service.findOne({ filter });
    return one;
  }

  @Query(() => ManyExampleEntity, {
    nullable: true,
    description: 'find many example',
  })
  async findManyExample(@Args() args: FindManyExampleArgs) {
    const { where, paging, sortBy, search } = args;
    const filter = ExampleWhereInputType.toFilter(where);
    const sort = ExampleWhereInputType.toSort(sortBy);

    const many = await this.service.findMany({
      filter,
      paging,
      sort,
      search,
    });

    return many;
  }
}

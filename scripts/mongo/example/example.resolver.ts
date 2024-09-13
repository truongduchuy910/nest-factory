/**
 * 📌 EXAMPLE RESOLVER
 */

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { ExampleEntity, ManyExampleEntity } from './example.entity';
import {
  CreateOneExampleArgs,
  FindManyExampleArgs,
  FindOneExampleArgs,
  UpdateOneExampleArgs,
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
  async updateOneExample(@Args() args: UpdateOneExampleArgs) {
    const { filter, input } = UpdateOneExampleArgs.convert(args);
    const updated = await this.model.findOneAndUpdate(filter, input, {
      new: true,
    });
    return updated.toEntity();
  }

  @Mutation(() => ExampleEntity, { nullable: true })
  async createOneExample(@Args() args: CreateOneExampleArgs) {
    const { input } = CreateOneExampleArgs.convert(args);
    const created = await this.model.create(input);
    return created.toEntity();
  }

  @Mutation(() => ExampleEntity, { nullable: true })
  async deleteOneExample(@Args() args: FindOneExampleArgs) {
    const { filter } = FindOneExampleArgs.convert(args);
    const deleted = await this.model.findOneAndDelete(filter, { new: true });
    return deleted.toEntity();
  }

  @Query(() => ExampleEntity, {
    nullable: true,
    description: 'find one example',
  })
  async findOneExample(@Args() args: FindOneExampleArgs) {
    const { filter } = FindOneExampleArgs.convert(args);
    const one = await this.service.findOne({ filter });
    return one;
  }

  @Query(() => ManyExampleEntity, {
    nullable: true,
    description: 'find many example',
  })
  async findManyExample(@Args() args: FindManyExampleArgs) {
    const { filter, paging, sort, search } = FindManyExampleArgs.convert(args);
    const many = await this.service.findMany({
      filter,
      paging,
      sort,
      search,
    });

    return many;
  }
}

/**
 * 📌 EXAMPLE RESOLVER
 */

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { ExampleEntity, ManyExampleEntity } from './example.entity';
import { ExampleService } from './example.service';
import {
  CreateManyExampleArgs,
  CreateOneExampleArgs,
  FindManyExampleArgs,
  FindOneExampleArgs,
  UpdateOneExampleArgs,
} from './example.args';

@Resolver(() => ExampleEntity)
export class ExampleResolver {
  readonly logger = new Logger(ExampleResolver.name);

  constructor(private readonly service: ExampleService) {}

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

  @Mutation(() => Number, { nullable: true })
  async deleteManyExample(@Args() args: FindManyExampleArgs) {
    const { filter } = FindManyExampleArgs.convert(args);
    const deleted = await this.service.deleteMany(filter);
    return deleted;
  }

  @Mutation(() => Number, { nullable: true })
  async createManyExample(@Args() args: CreateManyExampleArgs) {
    const { input } = CreateManyExampleArgs.convert(args);
    const created = await this.service.createMany(input);
    return created;
  }

  @Mutation(() => ExampleEntity, {
    nullable: true,
    description: 'create one example',
  })
  async createOneExample(@Args() args: CreateOneExampleArgs) {
    const { input } = CreateOneExampleArgs.convert(args);
    const created = await this.service.createOne(input);

    return created;
  }

  @Query(() => ExampleEntity, {
    nullable: true,
    description: 'find one example',
  })
  async findOneExample(@Args() args: FindOneExampleArgs) {
    const { filter } = FindOneExampleArgs.convert(args);
    const one = this.service.findOne(filter);
    return one;
  }

  @Mutation(() => ExampleEntity, {
    nullable: true,
    description: 'update one example',
  })
  async updateOneExample(@Args() args: UpdateOneExampleArgs) {
    const { filter, input } = UpdateOneExampleArgs.convert(args);
    const updated = await this.service.updateOne(filter, input);
    return updated;
  }

  @Mutation(() => ExampleEntity, {
    nullable: true,
    description: 'delete one example',
  })
  async deleteOneExample(@Args() args: FindOneExampleArgs) {
    const { filter } = FindOneExampleArgs.convert(args);
    const deleted = await this.service.deleteOne(filter);
    return deleted && new ExampleEntity(deleted);
  }
}

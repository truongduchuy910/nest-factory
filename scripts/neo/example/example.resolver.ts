/**
 * 📌 EXAMPLE RESOLVER
 */

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { Node } from 'nest-ogm';
import { ExampleEntity, ManyExampleEntity } from './example.entity';
import {
  CreateManyExampleArgs,
  CreateOneExampleArgs,
  DeleteOneExampleArgs,
  ExampleWhereInputType,
  FindManyExampleArgs,
  FindOneExampleArgs,
  UpdateOneExampleArgs,
} from './example.args';
import { ExampleService } from './example.service';

@Resolver(() => ExampleEntity)
export class ExampleResolver {
  node: Node;

  constructor(private readonly service: ExampleService) {
    this.node = this.service.getNode() as any;
  }

  @Mutation(() => [ExampleEntity], {
    nullable: true,
    description: 'create many example',
  })
  async createManyExample(@Args() args: CreateManyExampleArgs) {
    const { input } = CreateManyExampleArgs.convert(args);
    const many = await this.service.createMany(input);
    return many;
  }

  @Mutation(() => ExampleEntity, {
    nullable: true,
    description: 'create one example',
  })
  async createOneExample(@Args() args: CreateOneExampleArgs) {
    const { input } = CreateOneExampleArgs.convert(args);
    const one = await this.service.createOneV2(input);
    return one;
  }

  @Mutation(() => ExampleEntity, { nullable: true })
  async updateOneExample(@Args() args: UpdateOneExampleArgs) {
    const { filter, input } = UpdateOneExampleArgs.convert(args);
    const updated = await this.service.updateOne(filter, input);

    return updated;
  }

  @Mutation(() => [ExampleEntity], { nullable: true })
  async deleteManyExample(@Args() args: FindManyExampleArgs) {
    const { filter } = FindManyExampleArgs.convert(args);
    const deleted = await this.service.deleteMany(filter);
    return deleted;
  }

  @Mutation(() => ExampleEntity, { nullable: true })
  async deleteOneExample(@Args() args: DeleteOneExampleArgs) {
    const { filter } = DeleteOneExampleArgs.convert(args);
    const deleted = await this.service.deleteOne(filter);
    return deleted;
  }

  @Query(() => ExampleEntity, {
    nullable: true,
    description: 'find one example',
  })
  async findOneExample(@Args() args: FindOneExampleArgs) {
    const { filter } = FindOneExampleArgs.convert(args);

    const one = await this.service.findOne(filter);
    return one;
  }

  @Query(() => ManyExampleEntity, {
    nullable: true,
    description: 'find many example with cursor-based pagination.',
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

  @Query(() => ManyExampleEntity, {
    nullable: true,
    description: 'find many app with offset-based pagination.',
  })
  async findManyExampleWithPage(@Args() args: FindManyExampleArgs) {
    const filter = ExampleWhereInputType.toFilter(args.where);
    const many = await this.service.findMany({
      filter,
      paging: args.paging,
    });
    return many;
  }
}

/**
 * 📌 EXAMPLE RESOLVER
 */

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Node } from 'nest-ogm';
import { ExampleEntity, ManyExample } from './example.entity';
import {
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

  @Mutation(() => ExampleEntity, {
    nullable: true,
    description: 'create one example',
  })
  async createOneExample(@Args() args: CreateOneExampleArgs) {
    const { input } = CreateOneExampleArgs.convert(args);
    const many = await this.node.create({ input });
    const [created] = many?.neos;
    return created;
  }

  @Mutation(() => ExampleEntity, { nullable: true })
  async updateOneExample(@Args() args: UpdateOneExampleArgs) {
    const { filter, input } = UpdateOneExampleArgs.convert(args);
    const updated = await this.node.update({
      where: filter,
      update: input,
    });

    return updated;
  }

  @Mutation(() => ExampleEntity, { nullable: true })
  async deleteOneExample(@Args() args: DeleteOneExampleArgs) {
    const { index } = args;
    const deleted = await this.service.deleteOneById(index.id);
    return deleted;
  }

  @Query(() => ExampleEntity, {
    nullable: true,
    description: 'find one example',
  })
  async findOneExample(@Args() args: FindOneExampleArgs) {
    const { filter } = FindOneExampleArgs.convert(args);
    const many = await this.node.find({ where: filter });
    const [example] = many;
    return example;
  }

  @Query(() => ManyExample, {
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

  @Query(() => ManyExample, {
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

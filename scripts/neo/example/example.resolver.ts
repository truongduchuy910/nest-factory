/**
 * 📌 EXAMPLE RESOLVER
 */

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Node } from 'nest-ogm';
import { ExampleEntity, ManyExample } from './example.entity';
import {
  CreateOneExampleArgs,
  DeleteOneExampleArgs,
  ExampleWhereInput,
  FindManyExampleArgs,
  FindOneExampleArgs,
  UpdateOneExampleArgs,
} from './example.args';
import { ExampleService } from './example.service';
import { isEmpty } from 'lodash';
import { GraphQLError } from 'graphql';

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
    const created = await this.service.createOne(args.data);
    return created;
  }

  @Query(() => ExampleEntity, {
    nullable: true,
    description: 'find one example',
  })
  async findOneExample(@Args() args: FindOneExampleArgs) {
    const { index } = args;
    if (isEmpty(index.id)) return new GraphQLError(`Missing id`);

    const example = await this.service.findOneById(index.id);
    return example;
  }

  @Query(() => ManyExample, {
    nullable: true,
    description: 'find many example with cursor-based pagination.',
  })
  async findManyExample(@Args() args: FindManyExampleArgs) {
    const filter = ExampleWhereInput.toFilter(args.where);
    const sort = ExampleWhereInput.toSort(args.sortBy);
    const many = await this.service.findMany({
      filter,
      paging: args.paging,
      sort,
      search: args.search,
    });
    return many;
  }

  @Query(() => ManyExample, {
    nullable: true,
    description: 'find many app with offset-based pagination.',
  })
  async findManyExampleWithPage(@Args() args: FindManyExampleArgs) {
    const filter = ExampleWhereInput.toFilter(args.where);
    const many = await this.service.findMany({
      filter,
      paging: args.paging,
    });
    return many;
  }

  @Mutation(() => ExampleEntity, { nullable: true })
  async updateOneExample(@Args() args: UpdateOneExampleArgs) {
    const { index, data } = args;
    if (isEmpty(index.id)) return new GraphQLError(`Missing id`);

    const updated = await this.service.updateOneById(index.id, data);
    return updated;
  }

  @Mutation(() => ExampleEntity, { nullable: true })
  async deleteOneExample(@Args() args: DeleteOneExampleArgs) {
    const { index } = args;
    const deleted = await this.service.deleteOneById(index.id);
    return deleted;
  }
}

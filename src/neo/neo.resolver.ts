/**
 * 📌 NEO RESOLVER
 */

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Node } from 'nest-ogm';
import { NeoEntity, ManyNeo } from './neo.entity';
import {
  CreateOneNeoArgs,
  DeleteOneNeoArgs,
  NeoWhereInput,
  FindManyNeoArgs,
  FindOneNeoArgs,
  UpdateOneNeoArgs,
} from './neo.args';
import { NeoService } from './neo.service';
import { isEmpty } from 'lodash';
import { GraphQLError } from 'graphql';

@Resolver(() => NeoEntity)
export class NeoResolver {
  node: Node;

  constructor(private readonly service: NeoService) {
    this.node = this.service.getNode() as any;
  }

  @Mutation(() => NeoEntity, {
    nullable: true,
    description: 'create one neo',
  })
  async createOneNeo(@Args() args: CreateOneNeoArgs) {
    const created = await this.service.createOne(args.data);
    return created;
  }

  @Query(() => NeoEntity, {
    nullable: true,
    description: 'find one neo',
  })
  async findOneNeo(@Args() args: FindOneNeoArgs) {
    const { index } = args;
    if (isEmpty(index.id)) return new GraphQLError(`Missing id`);

    const neo = await this.service.findOneById(index.id);
    return neo;
  }

  @Query(() => ManyNeo, {
    nullable: true,
    description: 'find many neo with cursor-based pagination.',
  })
  async findManyNeo(@Args() args: FindManyNeoArgs) {
    const filter = NeoWhereInput.toFilter(args.where);
    const sort = NeoWhereInput.toSort(args.sortBy);
    const many = await this.service.findMany({
      filter,
      paging: args.paging,
      sort,
      search: args.search,
    });
    return many;
  }

  @Query(() => ManyNeo, {
    nullable: true,
    description: 'find many app with offset-based pagination.',
  })
  async findManyNeoWithPage(@Args() args: FindManyNeoArgs) {
    const filter = NeoWhereInput.toFilter(args.where);
    const many = await this.service.findMany({
      filter,
      paging: args.paging,
    });
    return many;
  }

  @Mutation(() => NeoEntity, { nullable: true })
  async updateOneNeo(@Args() args: UpdateOneNeoArgs) {
    const { index, data } = args;
    if (isEmpty(index.id)) return new GraphQLError(`Missing id`);

    const updated = await this.service.updateOneById(index.id, data);
    return updated;
  }

  @Mutation(() => NeoEntity, { nullable: true })
  async deleteOneNeo(@Args() args: DeleteOneNeoArgs) {
    const { index } = args;
    const deleted = await this.service.deleteOneById(index.id);
    return deleted;
  }
}

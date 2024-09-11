/**
 * 📌 NEO_4_J RESOLVER
 */

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Node } from 'nest-ogm';
import { Neo4jEntity, ManyNeo4j } from './neo4j.entity';
import {
  CreateOneNeo4jArgs,
  DeleteOneNeo4jArgs,
  Neo4jWhereInput,
  FindManyNeo4jArgs,
  FindOneNeo4jArgs,
  UpdateOneNeo4jArgs,
} from './neo4j.args';
import { Neo4jService } from './neo4j.service';
import { isEmpty } from 'lodash';
import { GraphQLError } from 'graphql';

@Resolver(() => Neo4jEntity)
export class Neo4jResolver {
  node: Node;

  constructor(private readonly service: Neo4jService) {
    this.node = this.service.getNode() as any;
  }

  @Mutation(() => Neo4jEntity, {
    nullable: true,
    description: 'create one neo4j',
  })
  async createOneNeo4j(@Args() args: CreateOneNeo4jArgs) {
    const created = await this.service.createOne(args.data);
    return created;
  }

  @Query(() => Neo4jEntity, {
    nullable: true,
    description: 'find one neo4j',
  })
  async findOneNeo4j(@Args() args: FindOneNeo4jArgs) {
    const { index } = args;
    if (isEmpty(index.id)) return new GraphQLError(`Missing id`);

    const neo4j = await this.service.findOneById(index.id);
    return neo4j;
  }

  @Query(() => ManyNeo4j, {
    nullable: true,
    description: 'find many neo4j with cursor-based pagination.',
  })
  async findManyNeo4j(@Args() args: FindManyNeo4jArgs) {
    const filter = Neo4jWhereInput.toFilter(args.where);
    const sort = Neo4jWhereInput.toSort(args.sortBy);
    const many = await this.service.findMany({
      filter,
      paging: args.paging,
      sort,
      search: args.search,
    });
    return many;
  }

  @Query(() => ManyNeo4j, {
    nullable: true,
    description: 'find many app with offset-based pagination.',
  })
  async findManyNeo4jWithPage(@Args() args: FindManyNeo4jArgs) {
    const filter = Neo4jWhereInput.toFilter(args.where);
    const many = await this.service.findMany({
      filter,
      paging: args.paging,
    });
    return many;
  }

  @Mutation(() => Neo4jEntity, { nullable: true })
  async updateOneNeo4j(@Args() args: UpdateOneNeo4jArgs) {
    const { index, data } = args;
    if (isEmpty(index.id)) return new GraphQLError(`Missing id`);

    const updated = await this.service.updateOneById(index.id, data);
    return updated;
  }

  @Mutation(() => Neo4jEntity, { nullable: true })
  async deleteOneNeo4j(@Args() args: DeleteOneNeo4jArgs) {
    const { index } = args;
    const deleted = await this.service.deleteOneById(index.id);
    return deleted;
  }
}

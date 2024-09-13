/**
 * 📌 NEO RESOLVER
 */

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Node } from 'nest-ogm';
import { NeoEntity, ManyNeo } from './neo.entity';
import {
  CreateOneNeoArgs,
  DeleteOneNeoArgs,
  NeoWhereInputType,
  FindManyNeoArgs,
  FindOneNeoArgs,
  UpdateOneNeoArgs,
} from './neo.args';
import { NeoService } from './neo.service';

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
    const { input } = CreateOneNeoArgs.convert(args);
    const many = await this.node.create({ input });
    const [created] = many?.neos;
    return created;
  }

  @Mutation(() => NeoEntity, { nullable: true })
  async updateOneNeo(@Args() args: UpdateOneNeoArgs) {
    const { filter, input } = UpdateOneNeoArgs.convert(args);
    const updated = await this.node.update({
      where: filter,
      update: input,
    });

    return updated;
  }

  @Mutation(() => NeoEntity, { nullable: true })
  async deleteOneNeo(@Args() args: DeleteOneNeoArgs) {
    const { index } = args;
    const deleted = await this.service.deleteOneById(index.id);
    return deleted;
  }

  @Query(() => NeoEntity, {
    nullable: true,
    description: 'find one neo',
  })
  async findOneNeo(@Args() args: FindOneNeoArgs) {
    const { filter } = FindOneNeoArgs.convert(args);
    const many = await this.node.find({ where: filter });
    const [neo] = many;
    return neo;
  }

  @Query(() => ManyNeo, {
    nullable: true,
    description: 'find many neo with cursor-based pagination.',
  })
  async findManyNeo(@Args() args: FindManyNeoArgs) {
    const { filter, paging, sort, search } = FindManyNeoArgs.convert(args);

    const many = await this.service.findMany({
      filter,
      paging,
      sort,
      search,
    });
    return many;
  }

  @Query(() => ManyNeo, {
    nullable: true,
    description: 'find many app with offset-based pagination.',
  })
  async findManyNeoWithPage(@Args() args: FindManyNeoArgs) {
    const filter = NeoWhereInputType.toFilter(args.where);
    const many = await this.service.findMany({
      filter,
      paging: args.paging,
    });
    return many;
  }
}

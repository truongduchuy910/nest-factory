/**
 * 📌 NEO RESOLVER
 */

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { Node } from 'nest-ogm';
import { NeoEntity, ManyNeoEntity } from './neo.entity';
import {
  CreateManyNeoArgs,
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

  @Mutation(() => [NeoEntity], {
    nullable: true,
    description: 'create many neo',
  })
  async createManyNeo(@Args() args: CreateManyNeoArgs) {
    const { input } = CreateManyNeoArgs.convert(args);
    const many = await this.service.createMany(input);
    return many;
  }

  @Mutation(() => NeoEntity, {
    nullable: true,
    description: 'create one neo',
  })
  async createOneNeo(@Args() args: CreateOneNeoArgs) {
    const { input } = CreateOneNeoArgs.convert(args);
    const one = await this.service.createOneV2(input);
    return one;
  }

  @Mutation(() => NeoEntity, { nullable: true })
  async updateOneNeo(@Args() args: UpdateOneNeoArgs) {
    const { filter, input } = UpdateOneNeoArgs.convert(args);
    const updated = await this.service.updateOne(filter, input);

    return updated;
  }

  @Mutation(() => [NeoEntity], { nullable: true })
  async deleteManyNeo(@Args() args: FindManyNeoArgs) {
    const { filter } = FindManyNeoArgs.convert(args);
    const deleted = await this.service.deleteMany(filter);
    return deleted;
  }

  @Mutation(() => NeoEntity, { nullable: true })
  async deleteOneNeo(@Args() args: DeleteOneNeoArgs) {
    const { filter } = DeleteOneNeoArgs.convert(args);
    const deleted = await this.service.deleteOne(filter);
    return deleted;
  }

  @Query(() => NeoEntity, {
    nullable: true,
    description: 'find one neo',
  })
  async findOneNeo(@Args() args: FindOneNeoArgs) {
    const { filter } = FindOneNeoArgs.convert(args);

    const one = await this.service.findOne(filter);
    return one;
  }

  @Query(() => ManyNeoEntity, {
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

  @Query(() => ManyNeoEntity, {
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

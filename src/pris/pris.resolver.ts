/**
 * 📌 PRIS RESOLVER
 */

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { PrisEntity, ManyPrisEntity } from './pris.entity';
import {
  CreateOnePrisArgs,
  FindManyPrisArgs,
  FindOnePrisArgs,
  UpdateOnePrisArgs,
} from './pris.args';
import { PrisService } from './pris.service';
import { PrisDocument } from './pris.schema';

@Resolver(() => PrisEntity)
export class PrisResolver {
  readonly logger = new Logger(PrisResolver.name);

  model: Model<PrisDocument>;

  constructor(private readonly service: PrisService) {
    this.model = this.service.getModel();
  }

  @Mutation(() => PrisEntity, { nullable: true })
  async updateOnePris(@Args() args: UpdateOnePrisArgs) {
    const { filter, input } = UpdateOnePrisArgs.convert(args);
    const updated = await this.model.findOneAndUpdate(filter, input, {
      new: true,
    });
    return updated.toEntity();
  }

  @Mutation(() => PrisEntity, { nullable: true })
  async createOnePris(@Args() args: CreateOnePrisArgs) {
    const { input } = CreateOnePrisArgs.convert(args);
    const created = await this.model.create(input);
    return created.toEntity();
  }

  @Mutation(() => PrisEntity, { nullable: true })
  async deleteOnePris(@Args() args: FindOnePrisArgs) {
    const { filter } = FindOnePrisArgs.convert(args);
    const deleted = await this.model.findOneAndDelete(filter, { new: true });
    return deleted.toEntity();
  }

  @Query(() => PrisEntity, {
    nullable: true,
    description: 'find one pris',
  })
  async findOnePris(@Args() args: FindOnePrisArgs) {
    const { filter } = FindOnePrisArgs.convert(args);
    const one = await this.service.findOne({ filter });
    return one;
  }

  @Query(() => ManyPrisEntity, {
    nullable: true,
    description: 'find many pris',
  })
  async findManyPris(@Args() args: FindManyPrisArgs) {
    const { filter, paging, sort, search } = FindManyPrisArgs.convert(args);
    const many = await this.service.findMany({
      filter,
      paging,
      sort,
      search,
    });

    return many;
  }
}

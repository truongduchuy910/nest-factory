/**
 * 📌 PRIS RESOLVER
 */

import { Args, Mutation, Query, Resolver, ResolveField } from '@nestjs/graphql';
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
import { Prisma } from '@prisma/client';

@Resolver(() => PrisEntity)
export class PrisResolver {
  readonly logger = new Logger(PrisResolver.name);

  //model: Model<PrisDocument>;

  constructor(private readonly service: PrisService) {
    //this.model = this.service.getModel();
  }

  //@Mutation(() => PrisEntity, { nullable: true })
  //async updateOnePris(@Args() args: UpdateOnePrisArgs) {
  //  const { filter, input } = UpdateOnePrisArgs.convert(args);
  //  const updated = await this.model.findOneAndUpdate(filter, input, {
  //    new: true,
  //  });
  //  return updated.toEntity();
  //}

  @Mutation(() => PrisEntity, {
    nullable: true,
    description: 'create one pris',
  })
  async createOnePris(@Args() args: CreateOnePrisArgs) {
    const { input } = CreateOnePrisArgs.convert(args);
    const created = await this.service.getModel().create({
      data: input,
    });
    return created && new PrisEntity(created);
  }

  @Mutation(() => PrisEntity, {
    nullable: true,
    description: 'delete one pris',
  })
  async deleteOnePris(@Args() args: FindOnePrisArgs) {
    const { filter } = FindOnePrisArgs.convert(args);
    const deleted = await this.service.getModel().delete({ where: filter });
    return deleted && new PrisEntity(deleted);
  }

  @Query(() => PrisEntity, {
    nullable: true,
    description: 'find one pris',
  })
  async findOnePris(@Args() args: FindOnePrisArgs) {
    const { filter } = FindOnePrisArgs.convert(args);
    const one = await this.service.getModel().findUnique({ where: filter });
    return one && new PrisEntity(one);
  }

  @Query(() => ManyPrisEntity, {
    nullable: true,
    description: 'find many pris',
  })
  async findManyPris(@Args() args: FindManyPrisArgs) {
    const { filter, paging, sort, search } = FindManyPrisArgs.convert(args);
    const many = await this.service.getModel().findMany({ where: filter });
    //const many = await this.service.findMany({
    //  filter,
    //  paging,
    //  sort,
    //  search,
    //});

    console.log(many);
  }
  @ResolveField()
  number(parent: PrisEntity) {
    return Number(parent.number);
  }
}

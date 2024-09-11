/**
 * 📌 EXAMPLE RESOLVER
 */

import { Args, Query, Resolver } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { Model } from 'mongoose';

import { ExampleEntity, ManyExampleEntity } from './example.entity';
import {
  ExampleIndexInputType,
  ExampleWhereInputType,
  FindManyExampleArgs,
  FindOneExampleArgs,
} from './example.args';
import { ExampleService } from './example.service';
import { ExampleDocument } from './example.schema';

@Resolver(() => ExampleEntity)
export class ExampleResolver {
  readonly logger = new Logger(ExampleResolver.name);

  model: Model<ExampleDocument>;

  constructor(private readonly service: ExampleService) {
    this.model = this.service.getModel();
  }

  @Query(() => ExampleEntity, {
    nullable: true,
    description: 'find one example',
  })
  async findOneExample(@Args() args: FindOneExampleArgs) {
    const { index } = args;
    const filter = ExampleIndexInputType.toFilter(index);
    const one = await this.service.findOne({ filter });
    return one;
  }

  @Query(() => ManyExampleEntity, {
    nullable: true,
    description: 'find many example',
  })
  async findManyExample(@Args() args: FindManyExampleArgs) {
    const { where } = args;
    const filter = ExampleWhereInputType.toFilter(where);
    const many = await this.service.findMany({
      filter,
      paging: args.paging,
    });
    return many;
  }
}

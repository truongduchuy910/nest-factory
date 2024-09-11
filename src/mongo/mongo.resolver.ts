/**
 * 📌 MONGO RESOLVER
 */

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { Model } from 'mongoose';

import { MongoEntity, ManyMongoEntity } from './mongo.entity';
import {
  CreateOneMongoArgs,
  MongoIndexInputType,
  MongoWhereInputType,
  FindManyMongoArgs,
  FindOneMongoArgs,
} from './mongo.args';
import { MongoService } from './mongo.service';
import { MongoDocument } from './mongo.schema';

@Resolver(() => MongoEntity)
export class MongoResolver {
  readonly logger = new Logger(MongoResolver.name);

  model: Model<MongoDocument>;

  constructor(private readonly service: MongoService) {
    this.model = this.service.getModel();
  }

  @Mutation(() => MongoEntity, { nullable: true })
  async createOneMongo(@Args() args: CreateOneMongoArgs) {
    const created = await this.model.create(args.data);
    return created;
  }

  @Query(() => MongoEntity, {
    nullable: true,
    description: 'find one mongo',
  })
  async findOneMongo(@Args() args: FindOneMongoArgs) {
    const { index } = args;
    const filter = MongoIndexInputType.toFilter(index);
    const one = await this.service.findOne({ filter });
    return one;
  }

  @Query(() => ManyMongoEntity, {
    nullable: true,
    description: 'find many mongo',
  })
  async findManyMongo(@Args() args: FindManyMongoArgs) {
    const { where, paging, sortBy, search } = args;
    const filter = MongoWhereInputType.toFilter(where);
    const sort = MongoWhereInputType.toSort(sortBy);

    const many = await this.service.findMany({
      filter,
      paging,
      sort,
      search,
    });

    return many;
  }
}

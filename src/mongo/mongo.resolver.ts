/**
 * 📌 MONGO RESOLVER
 */

import { Args, Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { MongoEntity, ManyMongoEntity } from './mongo.entity';
import {
  CreateManyMongoArgs,
  CreateOneMongoArgs,
  FindManyMongoArgs,
  FindOneMongoArgs,
  UpdateOneMongoArgs,
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
  async updateOneMongo(@Args() args: UpdateOneMongoArgs) {
    const { filter, input } = UpdateOneMongoArgs.convert(args);
    const updated = await this.model.findOneAndUpdate(filter, input, {
      new: true,
    });
    return updated?.toEntity();
  }

  @Mutation(() => MongoEntity, { nullable: true })
  async createManyMongo(@Args() args: CreateManyMongoArgs) {
    const { input } = CreateManyMongoArgs.convert(args);
    const created = await this.model.create(input);
    return created && created.map((one) => one?.toEntity());
  }

  @Mutation(() => MongoEntity, { nullable: true })
  async createOneMongo(@Args() args: CreateOneMongoArgs) {
    const { input } = CreateOneMongoArgs.convert(args);
    const created = await this.model.create(input);
    return created?.toEntity();
  }

  @Mutation(() => Number, { nullable: true })
  async deleteManyMongo(@Args() args: FindManyMongoArgs) {
    const { filter } = FindManyMongoArgs.convert(args);
    const deleted = await this.model.deleteMany(filter);
    return deleted?.deletedCount;
  }

  @Mutation(() => MongoEntity, { nullable: true })
  async deleteOneMongo(@Args() args: FindOneMongoArgs) {
    const { filter } = FindOneMongoArgs.convert(args);
    const deleted = await this.model.findOneAndDelete(filter, { new: true });
    return deleted?.toEntity();
  }

  @Query(() => MongoEntity, {
    nullable: true,
    description: 'find one mongo',
  })
  async findOneMongo(@Args() args: FindOneMongoArgs) {
    const { filter } = FindOneMongoArgs.convert(args);
    const one = await this.service.findOne({ filter });
    return one?.toEntity();
  }

  @Query(() => ManyMongoEntity, {
    nullable: true,
    description: 'find many mongo',
  })
  async findManyMongo(@Args() args: FindManyMongoArgs) {
    const { filter, paging, sort, search } = FindManyMongoArgs.convert(args);
    const many = await this.service.findMany({
      filter,
      paging,
      sort,
      search,
    });
    return many;
  }

  @ResolveField()
  id(parent: MongoDocument) {
    return parent?.id || `${parent._id}`;
  }
}

/**
 * 📌 EXAMPLE RESOLVER
 */

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { ExampleEntity } from './example.entity';
import { ExampleService } from './example.service';
import {
  CreateManyExampleArgs,
  CreateOneExampleArgs,
  FindManyExampleArgs,
  FindOneExampleArgs,
  UpdateOneExampleArgs,
} from './example.args';

@Resolver(() => ExampleEntity)
export class ExampleResolver {
  readonly logger = new Logger(ExampleResolver.name);

  constructor(private readonly service: ExampleService) {}

  @Mutation(() => Number, { nullable: true })
  async deleteManyExample(@Args() args: FindManyExampleArgs) {
    const { filter } = FindManyExampleArgs.convert(args);
    const deleted = await this.service.getModel().deleteMany({ where: filter });
    return deleted?.count;
  }

  @Mutation(() => Number, { nullable: true })
  async createManyExample(@Args() args: CreateManyExampleArgs) {
    const { input } = CreateManyExampleArgs.convert(args);
    const created = await this.service.getModel().createMany({ data: input });
    return created.count;
  }

  @Mutation(() => ExampleEntity, {
    nullable: true,
    description: 'create one example',
  })
  async createOneExample(@Args() args: CreateOneExampleArgs) {
    const { input } = CreateOneExampleArgs.convert(args);
    const created = await this.service.getModel().create({ data: input });

    return created && new ExampleEntity(created);
  }

  @Query(() => ExampleEntity, {
    nullable: true,
    description: 'find one example',
  })
  async findOneExample(@Args() args: FindOneExampleArgs) {
    const { filter } = FindOneExampleArgs.convert(args);
    const one = await this.service.getModel().findUnique({ where: filter });

    return one && new ExampleEntity(one);
  }

  @Mutation(() => ExampleEntity, {
    nullable: true,
    description: 'update one example',
  })
  async updateOneExample(@Args() args: UpdateOneExampleArgs) {
    const { filter, input } = UpdateOneExampleArgs.convert(args);
    const updated = await this.service.getModel().update({
      where: filter,
      data: input,
    });

    return updated && new ExampleEntity(updated);
  }

  @Mutation(() => ExampleEntity, {
    nullable: true,
    description: 'delete one example',
  })
  async deleteOneExample(@Args() args: FindOneExampleArgs) {
    const { filter } = FindOneExampleArgs.convert(args);
    const deleted = await this.service.getModel().delete({ where: filter });
    return deleted && new ExampleEntity(deleted);
  }
}

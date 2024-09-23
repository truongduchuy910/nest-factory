/**
 * 📌 EXAMPLE SCHEMA
 */

import { Injectable } from '@nestjs/common';
import { ExampleEntity } from './example.entity';
import { PrismaService } from 'src/prisma.service';
import { FindManyProps } from 'nest-gfc';
import { DEFAULT_KEY, Paging } from 'nest-pgpa';
import { Prisma } from '@prisma/client';
@Injectable()
export class ExampleCRUD {
  model: Prisma.exampleDelegate;
  constructor(prisma: PrismaService) {
    this.model = prisma.example;
  }

  toEntity(one?: ExampleEntity) {
    return one?.toEntity();
  }

  getModel() {
    return this.model;
  }
  async deleteMany(filter: Prisma.exampleWhereInput) {
    const deleted = await this.model.deleteMany({ where: filter });
    return deleted?.count;
  }

  async createMany(input: Prisma.exampleCreateManyInput[]) {
    const created = await this.model.createMany({ data: input });
    return created.count;
  }

  async createOne(input: Prisma.exampleCreateInput) {
    const created = await this.model.create({ data: input });

    return created && new ExampleEntity(created);
  }

  async findOne(filter: Prisma.exampleWhereUniqueInput) {
    const one = await this.model.findUnique({ where: filter });

    return one && new ExampleEntity(one);
  }

  async updateOne(
    filter: Prisma.exampleWhereUniqueInput,
    input: Prisma.exampleUpdateInput,
  ) {
    const updated = await this.model.update({
      where: filter,
      data: input,
    });

    return updated && new ExampleEntity(updated);
  }

  async deleteOne(filter: Prisma.exampleWhereUniqueInput) {
    const deleted = await this.model.delete({ where: filter });
    return deleted && new ExampleEntity(deleted);
  }

  async findMany(props: FindManyProps<ExampleEntity>) {
    const { filter, sort, build, skip, limit } = new Paging<ExampleEntity>({
      filter: props.filter,
      primary: props.sort,
      secondary: DEFAULT_KEY,
      search: props.search,
      paging: props.paging,
    });
    const many = await this.model.findMany({
      orderBy: sort,
      where: filter,
      take: limit,
      skip,
    });

    let data = await build(many, this.model);

    return data;
  }
}

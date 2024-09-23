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

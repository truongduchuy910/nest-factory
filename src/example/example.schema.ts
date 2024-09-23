/**
 * 📌 EXAMPLE SCHEMA
 */

import { Injectable } from '@nestjs/common';
import { ExampleEntity } from './example.entity';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ExampleCRUD {
  private prisma: PrismaService;
  constructor(prisma: PrismaService) {
    this.prisma = prisma;
  }

  toEntity(one?: ExampleEntity) {
    return one?.toEntity();
  }

  getModel() {
    return this.prisma.example;
  }
}

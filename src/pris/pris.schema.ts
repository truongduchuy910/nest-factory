/**
 * 📌 PRIS SCHEMA
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { HydratedDocument } from 'mongoose';
import { PrismaService } from 'src/prisma.service';
import { Pris } from '@prisma/client';

export const PRIS_NAME = 'pris';

@Schema({
  timestamps: { updatedAt: 'updatedAt_utc', createdAt: 'createdAt_utc' },
  id: true,
  collection: PRIS_NAME,
})
export class PrisSchema {
  constructor(partial: Partial<Pris>) {
    Object.assign(this, partial);
  }

  @Prop({ required: false, index: 'text', unique: true })
  string?: String;

  @Prop({ required: false, unique: true })
  date?: Date;

  @Prop({ required: false, unique: true })
  number?: Number;

  toEntity() {
    return this;
  }
}

export const PrisSchemaFactory = SchemaFactory.createForClass(PrisSchema);

PrisSchemaFactory.loadClass(PrisSchema);

export type PrisDocument = HydratedDocument<PrisSchema>;

@Injectable()
export class PrisCRUD {
  private prisma: PrismaService;
  constructor(prisma: PrismaService) {
    this.prisma = prisma;
  }

  toEntity(one: any) {
    return one;
  }

  getModel() {
    return this.prisma.pris;
  }
}

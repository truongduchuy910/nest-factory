/**
 * 📌 PRIS SCHEMA
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { HydratedDocument, Model } from 'mongoose';
import { Paging } from 'nest-mopa';
import { FindManyProps } from 'nest-gfc';

interface FindOneProps {
  filter: any;
}

export const PRIS_NAME = 'pris';

@Schema({
  timestamps: { updatedAt: 'updatedAt_utc', createdAt: 'createdAt_utc' },
  id: true,
  collection: PRIS_NAME,
})
export class PrisSchema {
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
  private model: Model<PrisDocument>;

  constructor(model: Model<PrisDocument>) {
    this.model = model;
  }

  toEntity(one: any) {
    return one;
  }

  toSortPaging(key: string) {
    const map = {
      string_ASC: {
        key: 'string',
        KeyType: String,
        order: Paging.ASC,
      },
      string_DESC: {
        key: 'string',
        KeyType: String,
        order: Paging.DESC,
      },
      number_ASC: {
        key: 'number',
        KeyType: Number,
        order: Paging.ASC,
      },
      number_DESC: {
        key: 'number',
        KeyType: Number,
        order: Paging.DESC,
      },
      date_ASC: {
        key: 'date',
        KeyType: Date,
        order: Paging.ASC,
      },
      date_DESC: {
        key: 'date',
        KeyType: Date,
        order: Paging.DESC,
      },
    };
    return map[key] || {};
  }

  getModel() {
    return this.model;
  }

  async findOne(props: FindOneProps) {
    const one = await this.model.findOne(props.filter);
    return one && this.toEntity(one);
  }

  async findMany(props: FindManyProps<PrisDocument>) {
    const { filter, sort, build } = new Paging<PrisDocument>({
      cursors: props?.paging?.cursors,
      filter: props.filter,

      toEntity: this.toEntity,
      search: props?.search,
      ...props.sort,
    });

    const limit = Number(props?.paging?.limit);
    const skip = Number(props?.paging?.offset);

    if (limit > 100) throw new Error('rate limit');
    let many = await this.model
      .find(filter)
      .sort(sort as any)
      .limit(limit)
      .skip(skip);

    let data = await build(many, this.model);
    return data;
  }
}

/**
 * 📌 EXAMPLE SCHEMA
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { HydratedDocument, Model } from 'mongoose';
import { FindManyProps, Paging } from 'nest-mopa';

interface FindOneProps {
  filter: any;
}

export const EXAMPLE_NAME = 'example';

@Schema({
  timestamps: { updatedAt: 'updatedAt_utc', createdAt: 'createdAt_utc' },
  id: true,
  collection: EXAMPLE_NAME,
})
export class ExampleSchema {
  @Prop({ required: false, index: 'text' })
  string?: String;

  @Prop({ required: false })
  date?: Date;

  @Prop({ required: false })
  number?: Number;
}

export const ExampleSchemaFactory = SchemaFactory.createForClass(ExampleSchema);

ExampleSchemaFactory.loadClass(ExampleSchema);

export type ExampleDocument = HydratedDocument<ExampleSchema>;

@Injectable()
export class ExampleCRUD {
  private model: Model<ExampleDocument>;

  constructor(model: Model<ExampleDocument>) {
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

  async findMany(props: FindManyProps<ExampleDocument>) {
    const { filter, sort, build } = new Paging<ExampleDocument>({
      cursors: props?.paging?.cursors,
      filter: props.filter,

      toEntity: this.toEntity,
      search: props?.search,
      ...props.sort,
    });

    const limit = Number(props?.paging?.limit);
    const skip = Number(props?.paging?.offset);

    if (limit > 100) throw new Error('rate limit');
    let many = await this.model.find(filter).sort(sort).limit(limit).skip(skip);

    let data = await build(many, this.model);
    return data;
  }
}

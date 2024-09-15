/**
 * 📌 EXAMPLE SCHEMA
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { HydratedDocument, Model } from 'mongoose';
import { DEFAULT_KEY, PagingV3 } from 'nest-mopa';
import { FindManyProps } from 'nest-gfc';

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
  @Prop({ required: false })
  label?: String;

  @Prop({ required: false, index: 'text', unique: true })
  string?: String;

  @Prop({ required: false, unique: true })
  date?: Date;

  @Prop({ required: false, unique: true })
  number?: Number;

  @Prop({ required: false, unique: false })
  duplicate?: Number;

  /* warn: it be overrided */
  toEntity() {
    return this;
  }
}

export const ExampleSchemaFactory = SchemaFactory.createForClass(ExampleSchema);

export type ExampleDocument = HydratedDocument<ExampleSchema>;

@Injectable()
export class ExampleCRUD {
  private model: Model<ExampleDocument>;

  constructor(model: Model<ExampleDocument>) {
    this.model = model;
  }

  toEntity(one?: ExampleSchema) {
    return one?.toEntity();
  }

  getModel() {
    return this.model;
  }

  async findOne(props: FindOneProps) {
    const one = await this.model.findOne(props.filter);
    return this.toEntity(one);
  }

  async findMany(props: FindManyProps<ExampleDocument>) {
    const { filter, sort, build, skip, limit } = new PagingV3<ExampleDocument>({
      filter: props.filter,
      primary: props.sort,
      secondary: DEFAULT_KEY,
      search: props.search,
      paging: props.paging,
    });
    let many = await this.model
      .find(filter)
      .sort(sort as any)
      .limit(limit)
      .skip(skip);
    let data = await build(many, this.model);
    return data;
  }
}

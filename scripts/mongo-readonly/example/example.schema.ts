/**
 * 📌 EXAMPLE SCHEMA
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { HydratedDocument, Model } from 'mongoose';
import { Paging, PagingInputInterface } from 'nest-mopa';

interface FindOneProps {
  filter: any;
}

interface FindManyProps {
  filter: any;
  paging: PagingInputInterface;
}

export const EXAMPLE_NAME = 'example';

@Schema({
  timestamps: { updatedAt: 'updatedAt_utc', createdAt: 'createdAt_utc' },
  id: true,
  collection: EXAMPLE_NAME,
})
export class ExampleSchema {
  @Prop({ required: false })
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

  getModel() {
    return this.model;
  }

  async findOne(props: FindOneProps) {
    const one = await this.model.findOne(props.filter);
    return one && this.toEntity(one);
  }

  async findMany(props: FindManyProps) {
    const { filter, sort, build } = new Paging<ExampleDocument>({
      cursors: props?.paging?.cursors,
      filter: props.filter,
      toEntity: this.toEntity,
    });

    const limit = Number(props?.paging?.limit);
    const skip = Number(props?.paging?.offset);

    if (limit > 100) throw new Error('rate limit');
    let many = await this.model.find(filter).sort(sort).limit(limit).skip(skip);

    let data = await build(many, this.model);
    return data;
  }
}

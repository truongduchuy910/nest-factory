/**
 * 📌 EXAMPLE SCHEMA
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { faker } from '@faker-js/faker/locale/vi';
import { Model } from 'mongoose';
import { Injectable, OnModuleInit } from '@nestjs/common';

import { ExampleInterface } from './example.interface';

import { Paging, PagingInputInterface } from 'nemopa';
import { BaseSchema } from '@leaderbook/schema';

interface FindManyProps {
  filter: any;
  paging: PagingInputInterface;
}

export const EXAMPLE_NAME = 'example';

@Schema({
  timestamps: { updatedAt: 'updatedAt_utc' },
  id: true,
  collection: EXAMPLE_NAME,
})
export class ExampleSchema extends BaseSchema<ExampleInterface> {
  @Prop()
  _id?: Types.ObjectId;

  @Prop({ required: false })
  label?: string;

  constructor(partial: Partial<ExampleSchema>) {
    super(partial);
  }

  static faker(): ExampleSchema {
    return new ExampleSchema({
      _id: new Types.ObjectId(),
      label: faker.lorem.paragraph(),
    });
  }

  toExampleEntity() {
    let entity = this.toEntity();
    return Object.assign(entity, {});
  }
}

export const ExampleSchemaFactory = SchemaFactory.createForClass(ExampleSchema);

ExampleSchemaFactory.loadClass(ExampleSchema);

export type ExampleDocument = HydratedDocument<ExampleSchema>;

@Injectable()
export class ExampleCRUD implements OnModuleInit {
  private model: Model<ExampleDocument>;

  constructor(model: Model<ExampleDocument>) {
    this.model = model;
  }

  onModuleInit() {}

  getModel() {
    return this.model;
  }

  async findMany(props: FindManyProps) {
    const { filter, sort, build } = new Paging<ExampleDocument>({
      cursors: props?.paging?.cursors,
      filter: props.filter,
    });

    const limit = Number(props?.paging?.limit);
    const skip = Number(props?.paging?.offset);

    if (limit > 100) throw new Error('rate limit');
    const many = await this.model
      .find(filter)
      .sort(sort)
      .limit(limit)
      .skip(skip);

    return build(many, this.model);
  }
}

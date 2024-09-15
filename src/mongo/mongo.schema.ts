/**
 * 📌 MONGO SCHEMA
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { HydratedDocument, Model } from 'mongoose';
import { DEFAULT_KEY, PagingV3 } from 'nest-mopa';
import { FindManyProps } from 'nest-gfc';

interface FindOneProps {
  filter: any;
}

export const MONGO_NAME = 'mongo';

@Schema({
  timestamps: { updatedAt: 'updatedAt_utc', createdAt: 'createdAt_utc' },
  id: true,
  collection: MONGO_NAME,
})
export class MongoSchema {
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

export const MongoSchemaFactory = SchemaFactory.createForClass(MongoSchema);

export type MongoDocument = HydratedDocument<MongoSchema>;

@Injectable()
export class MongoCRUD {
  private model: Model<MongoDocument>;

  constructor(model: Model<MongoDocument>) {
    this.model = model;
  }

  toEntity(one?: MongoSchema) {
    return one?.toEntity();
  }

  getModel() {
    return this.model;
  }

  async findOne(props: FindOneProps) {
    const one = await this.model.findOne(props.filter);
    return this.toEntity(one);
  }

  async findMany(props: FindManyProps<MongoDocument>) {
    const { filter, sort, build, skip, limit } = new PagingV3<MongoDocument>({
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

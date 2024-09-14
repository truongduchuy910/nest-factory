/**
 * 📌 MONGO SCHEMA
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { HydratedDocument, Model } from 'mongoose';
import { Paging } from 'nest-mopa';
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
    const { filter, sort, build } = new Paging<MongoDocument>({
      toEntity: this.toEntity,
      cursors: props?.paging?.cursors,
      filter: props.filter,
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

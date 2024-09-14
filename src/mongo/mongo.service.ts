/**
 * 📌 MONGO SERVICE
 */

import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';

import { MongoCRUD, MongoDocument, MongoSchema } from './mongo.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MongoService extends MongoCRUD {
  readonly logger = new Logger(MongoService.name);
  constructor(@InjectModel(MongoSchema.name) model: Model<MongoDocument>) {
    super(model);
  }
}

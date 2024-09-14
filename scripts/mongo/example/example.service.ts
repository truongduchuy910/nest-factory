/**
 * 📌 EXAMPLE SERVICE
 */

import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';

import { ExampleCRUD, ExampleDocument, ExampleSchema } from './example.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ExampleService extends ExampleCRUD {
  readonly logger = new Logger(ExampleService.name);
  constructor(@InjectModel(ExampleSchema.name) model: Model<ExampleDocument>) {
    super(model);
  }
}

/**
 * 📌 EXAMPLE SERVICE
 */

import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ExampleCRUD, ExampleDocument, ExampleSchema } from './example.schema';

@Injectable()
export class ExampleService extends ExampleCRUD {
  readonly logger = new Logger(ExampleService.name);

  constructor(@InjectModel(ExampleSchema.name) model: Model<ExampleDocument>) {
    super(model);
  }
}

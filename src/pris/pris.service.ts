/**
 * 📌 PRIS SERVICE
 */

import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';

import { PrisCRUD, PrisDocument, PrisSchema } from './pris.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PrisService extends PrisCRUD {
  readonly logger = new Logger(PrisService.name);

  constructor(@InjectModel(PrisSchema.name) model: Model<PrisDocument>) {
    super(model);
  }
}

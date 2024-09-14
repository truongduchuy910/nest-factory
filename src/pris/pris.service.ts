/**
 * 📌 PRIS SERVICE
 */

import { Injectable, Logger } from '@nestjs/common';

import { PrisCRUD } from './pris.schema';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PrisService extends PrisCRUD {
  readonly logger = new Logger(PrisService.name);

  constructor(prisma: PrismaService) {
    super(prisma);
  }
}

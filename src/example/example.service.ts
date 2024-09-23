/**
 * 📌 EXAMPLE SERVICE
 */

import { Injectable, Logger } from '@nestjs/common';
import { ExampleCRUD } from './example.schema';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ExampleService extends ExampleCRUD {
  readonly logger = new Logger(ExampleService.name);

  constructor(prisma: PrismaService) {
    super(prisma);
  }
}

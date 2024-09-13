import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PrisResolver, PrisSchema, PrisService } from './pris.module';

/**
 * READ MORE:
 * - https://stackoverflow.com/questions/55143467/testing-mongoose-models-with-nestjs
 */

type PrisModel = Model<PrisSchema>;
const PrisModelToken = getModelToken(PrisSchema.name);

describe('Pris', () => {
  let resolver: PrisResolver;
  let service: PrisService;
  let model: PrisModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrisResolver,
        PrisService,
        {
          provide: PrisModelToken,
          useValue: Model,
        },
      ],
    }).compile();

    resolver = module.get<PrisResolver>(PrisResolver);
    service = module.get<PrisService>(PrisService);
    model = module.get<PrisModel>(PrisModelToken);
  });

  it('service > should be defined', () => {
    expect(service).toBeDefined();
  });

  it('model > should be defined', () => {
    expect(model).toBeDefined();
  });

  it('service.findMany > should be defined', () => {
    expect(service.findMany).toBeDefined();
  });

  it('resolver.manyPris', async () => {
    const length = 5;
    const docs = Array.from({ length }, (_) => {
      return PrisSchema.faker();
    });
    jest.spyOn(model, 'count').mockReturnValue(length as any);
    jest.spyOn(model, 'find').mockReturnValue({
      sort: () => ({
        limit: () => ({
          skip: () => docs,
        }),
      }),
    } as any);
    const many = await resolver.findManyPris({
      where: null,
      paging: null,
    });
    expect(many.data).toEqual(docs);
  });

  it('resolver.onePris > should return valid id', async () => {
    const doc = PrisSchema.faker();
    jest.spyOn(model, 'findOne').mockReturnValue(doc as any);
    const one = await resolver.findOnePris({
      index: { id: `${doc._id}` },
    });
    expect(one.id).toEqual(doc.id);
  });
});

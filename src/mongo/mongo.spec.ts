import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoResolver, MongoSchema, MongoService } from './mongo.module';

/**
 * READ MORE:
 * - https://stackoverflow.com/questions/55143467/testing-mongoose-models-with-nestjs
 */

type MongoModel = Model<MongoSchema>;
const MongoModelToken = getModelToken(MongoSchema.name);

describe('Mongo', () => {
  let resolver: MongoResolver;
  let service: MongoService;
  let model: MongoModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MongoResolver,
        MongoService,
        {
          provide: MongoModelToken,
          useValue: Model,
        },
      ],
    }).compile();

    resolver = module.get<MongoResolver>(MongoResolver);
    service = module.get<MongoService>(MongoService);
    model = module.get<MongoModel>(MongoModelToken);
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

  it('resolver.manyMongo', async () => {
    const length = 5;
    const docs = Array.from({ length }, (_) => {
      return MongoSchema.faker();
    });
    jest.spyOn(model, 'count').mockReturnValue(length as any);
    jest.spyOn(model, 'find').mockReturnValue({
      sort: () => ({
        limit: () => ({
          skip: () => docs,
        }),
      }),
    } as any);
    const many = await resolver.findManyMongo({
      where: null,
      paging: null,
    });
    expect(many.data).toEqual(docs);
  });

  it('resolver.oneMongo > should return valid id', async () => {
    const doc = MongoSchema.faker();
    jest.spyOn(model, 'findOne').mockReturnValue(doc as any);
    const one = await resolver.findOneMongo({
      index: { id: `${doc._id}` },
    });
    expect(one.id).toEqual(doc.id);
  });
});

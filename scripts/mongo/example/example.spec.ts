import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ExampleResolver,
  ExampleSchema,
  ExampleService,
} from './example.module';

/**
 * READ MORE:
 * - https://stackoverflow.com/questions/55143467/testing-mongoose-models-with-nestjs
 */

type ExampleModel = Model<ExampleSchema>;
const ExampleModelToken = getModelToken(ExampleSchema.name);

describe('Example', () => {
  let resolver: ExampleResolver;
  let service: ExampleService;
  let model: ExampleModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExampleResolver,
        ExampleService,
        {
          provide: ExampleModelToken,
          useValue: Model,
        },
      ],
    }).compile();

    resolver = module.get<ExampleResolver>(ExampleResolver);
    service = module.get<ExampleService>(ExampleService);
    model = module.get<ExampleModel>(ExampleModelToken);
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

  it('resolver.manyExample', async () => {
    const length = 5;
    const docs = Array.from({ length }, (_) => {
      return ExampleSchema.faker();
    });
    jest.spyOn(model, 'count').mockReturnValue(length as any);
    jest.spyOn(model, 'find').mockReturnValue({
      sort: () => ({
        limit: () => ({
          skip: () => docs,
        }),
      }),
    } as any);
    const many = await resolver.findManyExample({
      where: null,
      paging: null,
    });
    expect(many.data).toEqual(docs);
  });

  it('resolver.oneExample > should return valid id', async () => {
    const doc = ExampleSchema.faker();
    jest.spyOn(model, 'findOne').mockReturnValue(doc as any);
    const one = await resolver.findOneExample({
      index: { id: `${doc._id}` },
    });
    expect(one.id).toEqual(doc.id);
  });
});

import {
  createManyMongo,
  createOneMongo,
  deleteOneMongo,
  updateOneMongo,
} from './mutation/mongo';
import { customAlphabet } from 'nanoid';
import { findManyMongo, findOneMongo } from './query/mongo';
import { Types } from 'mongoose';

describe('create one', () => {
  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 8);
  const tid = nanoid();
  const data = {
    id: new Types.ObjectId(),
    string: nanoid(),
    date: new Date(),
    number: Date.now(),
    label: tid,
  };

  beforeAll(async () => {
    await createOneMongo({
      data,
    });
  });

  test('read one', async () => {
    const one = await findOneMongo({
      index: { id: data.id },
      label: 'after create',
    });
    expect(one.string).toBe(data.string);
  });

  test('read many', async () => {
    const many = await findManyMongo({ where: { id: data.id } });
    const [first] = many.data;
    expect(first.string).toBe(data.string);
  });

  describe('update', () => {
    const content = nanoid();
    beforeAll(async () => {
      await updateOneMongo({
        data: { string: content },
        index: {
          id: data.id.toString(),
        },
      });
    });
    test('read', async () => {
      const one = await findOneMongo({
        index: { id: data.id },
      });
      expect(one.string).toBe(content);
    });

    describe('delete', () => {
      beforeAll(async () => {
        await deleteOneMongo({
          index: { id: data.id },
        });
      });
      test('read', async () => {
        const one = await findOneMongo({ index: { id: data.id } });
        expect(one).not.toBeTruthy();
      });
    });
  });
});

describe('create many', () => {
  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 8);
  const tid = nanoid();
  const date = new Date();
  let data = Array.from({ length: 10 }, (_, i) => {
    const uniq = date.setSeconds(i);
    return {
      id: new Types.ObjectId(),
      string: nanoid(),
      date: new Date(uniq),
      number: uniq,
      label: tid,
    };
  });
  beforeAll(async () => {
    await createManyMongo({
      data,
    });
  });

  test('read many', async () => {
    const many = await findManyMongo({ where: { label: tid } });
    expect(many.data.length).toBe(data.length);
  });

  data.map((item) => {
    describe('delete', () => {
      beforeAll(async () => {
        await deleteOneMongo({
          index: { id: item.id },
        });
      });
      test('read', async () => {
        const one = await findOneMongo({ index: { id: item.id } });
        expect(one).not.toBeTruthy();
      });
    });
  });
});

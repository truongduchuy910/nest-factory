import {
  createManyMongo,
  createOneMongo,
  deleteManyMongo,
  deleteOneMongo,
  updateOneMongo,
} from './mutation/mongo';
import { customAlphabet } from 'nanoid';
import {
  findManyMongo,
  findManyMongoCursor,
  findOneMongo,
} from './query/mongo';
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

describe('create many unique', () => {
  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 8);
  const tid = nanoid();
  const date = new Date();
  let data = Array.from({ length: 62 }, (_, i) => {
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

  test('read many without limit', async () => {
    const many = await findManyMongo({ where: { label: tid } });
    expect(many.data.length).toBe(data.length);
  });

  test('read many with limit 2', async () => {
    const limit = 2;
    let props = {
      where: { label: tid },
      paging: { limit },
    };
    const many = await findManyMongo(props);
    expect(many.data.length).toBe(limit);
  });

  test('default cursor-based pagination', async () => {
    const limit = 3;
    let props = {
        where: { label: tid },
        paging: { limit, cursors: null },
      },
      many: any,
      hasNext = true,
      mongos = [];
    while ((many = hasNext && (await findManyMongo(props)))) {
      const next = many?.paging?.next || {};
      mongos.push(...many.data);
      expect(next.count || 0).toBe(data.length - mongos.length);
      hasNext = next.count > 0;
      delete next.count;
      props.paging.cursors = next;
    }
  });

  test('string_ASC cursor-based pagination', async () => {
    const mongos = await findManyMongoCursor({ tid, sortBy: 'string_ASC' });
    const sorted = data.map((i) => i.string).sort((a, b) => (a > b ? 1 : -1));
    expect(sorted).toStrictEqual(mongos.map((i) => i.string));
  });

  test('string_DESC cursor-based pagination', async () => {
    const mongos = await findManyMongoCursor({ tid, sortBy: 'string_DESC' });
    const sorted = data
      .map((i) => i.string)
      .sort((a, b) => (a > b ? 1 : -1))
      .reverse();
    expect(sorted).toStrictEqual(mongos.map((i) => i.string));
  });

  test('number_ASC cursor-based pagination', async () => {
    const mongos = await findManyMongoCursor({ tid, sortBy: 'number_ASC' });
    const sorted = data.map((i) => i.number).sort((a, b) => (a > b ? 1 : -1));
    expect(sorted).toStrictEqual(mongos.map((i) => i.number));
  });

  test('number_DESC cursor-based pagination', async () => {
    const mongos = await findManyMongoCursor({ tid, sortBy: 'number_DESC' });
    const sorted = data
      .map((i) => i.number)
      .sort((a, b) => (a > b ? 1 : -1))
      .reverse();
    expect(sorted).toStrictEqual(mongos.map((i) => i.number));
  });

  test('date_ASC cursor-based pagination', async () => {
    const mongos = await findManyMongoCursor({ tid, sortBy: 'date_ASC' });
    const sorted = data
      .map((i) => i.date.toISOString())
      .sort((a, b) => (a > b ? 1 : -1));
    expect(sorted).toStrictEqual(mongos.map((i) => i.date));
  });

  test('date_DESC cursor-based pagination', async () => {
    const mongos = await findManyMongoCursor({ tid, sortBy: 'date_DESC' });
    const sorted = data
      .map((i) => i.date.toISOString())
      .sort((a, b) => (a > b ? 1 : -1))
      .reverse();
    expect(sorted).toStrictEqual(mongos.map((i) => i.date));
  });

  describe(`delete many`, () => {
    beforeAll(async () => {
      await deleteManyMongo({ where: { label: tid } });
    });
    test('read many', async () => {
      const many = await findManyMongo({ where: { label: tid } });
      expect(many?.data?.length || 0).toBe(0);
    });
  });
});

describe('create many with duplicate', () => {
  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 8);
  const tid = nanoid();
  const date = new Date();
  let data = Array.from({ length: 62 }, (_, i) => {
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

  test('default cursor-based pagination', async () => {
    const limit = 3;
    let props = {
        where: { label: tid },
        paging: { limit, cursors: null },
      },
      many: any,
      hasNext = true,
      mongos = [];
    while ((many = hasNext && (await findManyMongo(props)))) {
      const next = many?.paging?.next || {};
      mongos.push(...many.data);
      expect(next.count || 0).toBe(data.length - mongos.length);
      hasNext = next.count > 0;
      delete next.count;
      props.paging.cursors = next;
    }
  });

  describe(`delete many`, () => {
    beforeAll(async () => {
      await deleteManyMongo({ where: { label: tid } });
    });
    test('read many', async () => {
      const many = await findManyMongo({ where: { label: tid } });
      expect(many?.data?.length || 0).toBe(0);
    });
  });
});

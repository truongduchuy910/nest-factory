import {
  createManyExample,
  createOneExample,
  deleteManyExample,
  deleteOneExample,
  updateOneExample,
} from './mutation/example';
import { customAlphabet } from 'nanoid';
import {
  findManyExample,
  findManyExampleCursor,
  findOneExample,
} from './query/example';
import { waitForHealth } from './common/config';

describe('create one', () => {
  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 8);
  const min = 0,
    max = 9999;
  const data = {
    id: null,
    string: nanoid(),
    date: new Date(),
    number: Math.floor(Math.random() * (max - min + 1) + min),
  };

  beforeAll(async () => {
    await waitForHealth();
    const created = await createOneExample({
      data,
    });
    data.id = created.id;
  });

  test('read one', async () => {
    const one = await findOneExample({
      index: { id: data.id },
    });
    expect(one.id).toBe(data.id);
    expect(one.string).toBe(data.string);
    expect(one.date).toBe(data.date.toISOString());
    expect(one.number).toBe(data.number);
  });

  describe('update', () => {
    const content = nanoid();
    beforeAll(async () => {
      await updateOneExample({
        data: { string: content },
        index: {
          id: data.id,
        },
      });
    });

    test('read', async () => {
      const after = await findOneExample({
        index: { id: data.id },
      });
      expect(after.string).toBe(content);
    });

    describe('delete', () => {
      beforeAll(async () => {
        await deleteOneExample({
          index: { id: data.id },
        });
      });

      test('read', async () => {
        const one = await findOneExample({ index: { id: data.id } });
        expect(one).not.toBeTruthy();
      });
    });
  });
});

describe('create many unique', () => {
  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 8);
  const tid = nanoid();
  const min = 0,
    max = 999999;
  const date = new Date();
  const random = Math.floor(Math.random() * (max - min + 1) + min);
  let data = Array.from({ length: 32 }, (_, i) => {
    const uniq = date.setSeconds(i);
    return {
      id: null,
      string: nanoid(),
      date: new Date(uniq),
      number: random + i,
      label: tid,
    };
  });
  beforeAll(async () => {
    await waitForHealth();
    await createManyExample({
      data,
    });
  });

  test('read many without limit', async () => {
    expect(1).toBeTruthy();
    const many = await findManyExample({ where: { label: tid } });
    expect(many.data.length).toBe(data.length);
  });

  test('read many with limit 2', async () => {
    const limit = 2;
    let props = {
      where: { label: tid },
      paging: { limit },
    };
    const many = await findManyExample(props);
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
    while ((many = hasNext && (await findManyExample(props)))) {
      const next = many?.paging?.next || {};
      mongos.push(...many.data);
      expect(next.count || 0).toBe(data.length - mongos.length);
      hasNext = next.count > 0;
      delete next.count;
      props.paging.cursors = next;
    }
  });

  test('string_ASC cursor-based pagination', async () => {
    const mongos = await findManyExampleCursor({ tid, sortBy: 'string_ASC' });
    const sorted = data.map((i) => i.string).sort((a, b) => (a > b ? 1 : -1));
    expect(sorted).toStrictEqual(mongos.map((i) => i.string));
  });

  test('string_DESC cursor-based pagination', async () => {
    const mongos = await findManyExampleCursor({ tid, sortBy: 'string_DESC' });
    const sorted = data
      .map((i) => i.string)
      .sort((a, b) => (a > b ? 1 : -1))
      .reverse();
    expect(sorted).toStrictEqual(mongos.map((i) => i.string));
  });

  test('number_ASC cursor-based pagination', async () => {
    const mongos = await findManyExampleCursor({ tid, sortBy: 'number_ASC' });
    const sorted = data.map((i) => i.number).sort((a, b) => (a > b ? 1 : -1));
    expect(sorted).toStrictEqual(mongos.map((i) => i.number));
  });

  test('number_DESC cursor-based pagination', async () => {
    const mongos = await findManyExampleCursor({ tid, sortBy: 'number_DESC' });
    const sorted = data
      .map((i) => i.number)
      .sort((a, b) => (a > b ? 1 : -1))
      .reverse();
    expect(sorted).toStrictEqual(mongos.map((i) => i.number));
  });

  test('date_ASC cursor-based pagination', async () => {
    const mongos = await findManyExampleCursor({ tid, sortBy: 'date_ASC' });
    const sorted = data
      .map((i) => i.date.toISOString())
      .sort((a, b) => (a > b ? 1 : -1));
    expect(sorted).toStrictEqual(mongos.map((i) => i.date));
  });

  test('date_DESC cursor-based pagination', async () => {
    const mongos = await findManyExampleCursor({ tid, sortBy: 'date_DESC' });
    const sorted = data
      .map((i) => i.date.toISOString())
      .sort((a, b) => (a > b ? 1 : -1))
      .reverse();
    expect(sorted).toStrictEqual(mongos.map((i) => i.date));
  });

  describe(`delete many`, () => {
    beforeAll(async () => {
      await deleteManyExample({ where: { label: tid } });
    });

    test('read many', async () => {
      const many = await findManyExample({ where: { label: tid } });
      expect(many?.data?.length || 0).toBe(0);
    });
  });
});

describe('create many with duplicate', () => {
  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 8);
  const tid = nanoid();
  const min = 0,
    max = 999999;
  const date = new Date();
  const random = Math.floor(Math.random() * (max - min + 1) + min);
  let data = Array.from({ length: 62 }, (_, i) => {
    const uniq = date.setSeconds(i);
    const duplicate = Math.floor(Math.random() * 9) + 1;
    return {
      id: null,
      string: nanoid(),
      date: new Date(uniq),
      number: random + i,
      label: tid,
      duplicate,
    };
  });

  beforeAll(async () => {
    await createManyExample({
      data,
    });
  });

  test('duplicate_ASC cursor-based pagination', async () => {
    const mongos = await findManyExampleCursor({
      tid,
      sortBy: 'duplicate_ASC',
      limit: 2,
    });

    const sorted = data
      .map((i) => i.duplicate)
      .sort((a, b) => (a > b ? 1 : -1));
    expect(sorted).toStrictEqual(mongos.map((i) => i.duplicate));
  });

  test('duplicate_DESC cursor-based pagination', async () => {
    const mongos = await findManyExampleCursor({
      tid,
      sortBy: 'duplicate_DESC',
      limit: 2,
    });

    const sorted = data
      .map((i) => i.duplicate)
      .sort((a, b) => (a > b ? 1 : -1))
      .reverse();
    expect(sorted).toStrictEqual(mongos.map((i) => i.duplicate));
  });

  describe(`delete many`, () => {
    beforeAll(async () => {
      await deleteManyExample({ where: { label: tid } });
    });
    test('read many', async () => {
      const many = await findManyExample({ where: { label: tid } });
      expect(many?.data?.length || 0).toBe(0);
    });
  });
});

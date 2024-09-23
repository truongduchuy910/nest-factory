import {
  createManyNeo,
  createOneNeo,
  deleteOneNeo,
  deleteManyNeo,
  updateOneNeo,
} from './mutation/neo';
import { customAlphabet } from 'nanoid';
import { findManyNeo, findManyNeoCursor, findOneNeo } from './query/neo';
import { waitForHealth } from './common/config';

describe('create', () => {
  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 8);
  let data = {
    id: null,
    string: nanoid(),
    date: new Date(),
    number: Date.now(),
  };

  beforeAll(async () => {
    await waitForHealth();
    delete data.id;
    const created = await createOneNeo({
      data,
    });
    data.id = created.id;
  });

  test('read one', async () => {
    const one = await findOneNeo({
      index: { id: data.id },
      label: 'after create',
    });
    expect(one.id).toBe(data.id.toString());
    expect(one.string).toBe(data.string);
    expect(one.date).toBe(data.date.toISOString());
    expect(one.number).toBe(data.number);
  });

  test('read many', async () => {
    const many = await findManyNeo({ where: { id: data.id } });
    expect(many.paging.count).toBe(1);
    expect(many.paging.next).not.toBeTruthy();
    const [first] = many.data;
    expect(first.id).toBe(data.id.toString());
    expect(first.string).toBe(data.string);
    expect(first.date).toBe(data.date.toISOString());
    expect(first.number).toBe(data.number);
  });

  describe('update', () => {
    const content = nanoid();
    beforeAll(async () => {
      await updateOneNeo({
        data: { string: content },
        index: {
          id: data.id.toString(),
        },
      });
    });
    test('read', async () => {
      const after = await deleteOneNeo({
        index: { id: data.id },
      });
      expect(after.string).toBe(content);
    });

    describe('delete', () => {
      beforeAll(async () => {});
      test('read', async () => {
        const one = await findOneNeo({ index: { id: data.id } });
        expect(one).not.toBeTruthy();
      });
    });
  });
});

describe('create many unique', () => {
  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 8);
  const tid = nanoid();
  const date = new Date();
  let data: { string?: string; date?: Date; number?: number; id?: string }[] =
    Array.from({ length: 32 }, (_, i) => {
      const uniq = date.setSeconds(i);
      return {
        string: nanoid(),
        date: new Date(uniq),
        number: uniq,
        label: tid,
      };
    });

  beforeAll(async () => {
    await waitForHealth();
    const created = await createManyNeo({
      data,
    });
    data = created.map((i) => {
      i.date &&= new Date(i.date);
      return i;
    });
  });

  test('read many without limit', async () => {
    const many = await findManyNeo({ where: { label: tid } });
    expect(many.data.length).toBe(data.length);
  });

  test('read many with limit 2', async () => {
    const limit = 2;
    let props = {
      where: { label: tid },
      paging: { limit },
    };
    const many = await findManyNeo(props);
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
      neos = [];
    while ((many = hasNext && (await findManyNeo(props)))) {
      const next = many?.paging?.next || {};
      neos.push(...many.data);
      expect(next.count || 0).toBe(data.length - neos.length);
      hasNext = next.count > 0;
      delete next.count;
      props.paging.cursors = next;
    }
  });

  test('string_ASC cursor-based pagination', async () => {
    const neos = await findManyNeoCursor({ tid, sortBy: 'string_ASC' });
    const sorted = data.map((i) => i.string).sort((a, b) => (a > b ? 1 : -1));
    expect(sorted).toStrictEqual(neos.map((i) => i.string));
  });

  test('string_DESC cursor-based pagination', async () => {
    const neos = await findManyNeoCursor({ tid, sortBy: 'string_DESC' });
    const sorted = data
      .map((i) => i.string)
      .sort((a, b) => (a > b ? 1 : -1))
      .reverse();
    expect(sorted).toStrictEqual(neos.map((i) => i.string));
  });

  test('number_ASC cursor-based pagination', async () => {
    const neos = await findManyNeoCursor({ tid, sortBy: 'number_ASC' });
    const sorted = data.map((i) => i.number).sort((a, b) => (a > b ? 1 : -1));
    expect(sorted).toStrictEqual(neos.map((i) => i.number));
  });

  test('number_DESC cursor-based pagination', async () => {
    const neos = await findManyNeoCursor({ tid, sortBy: 'number_DESC' });
    const sorted = data
      .map((i) => i.number)
      .sort((a, b) => (a > b ? 1 : -1))
      .reverse();
    expect(sorted).toStrictEqual(neos.map((i) => i.number));
  });

  test('date_ASC cursor-based pagination', async () => {
    const neos = await findManyNeoCursor({ tid, sortBy: 'date_ASC' });
    const sorted = data
      .map((i) => i.date.toISOString())
      .sort((a, b) => (a > b ? 1 : -1));
    expect(sorted).toStrictEqual(neos.map((i) => i.date));
  });

  test('date_DESC cursor-based pagination', async () => {
    const neos = await findManyNeoCursor({ tid, sortBy: 'date_DESC' });
    const sorted = data
      .map((i) => i.date.toISOString())
      .sort((a, b) => (a > b ? 1 : -1))
      .reverse();
    expect(sorted).toStrictEqual(neos.map((i) => i.date));
  });

  describe(`delete many`, () => {
    beforeAll(async () => {
      await deleteManyNeo({ where: { label: tid } });
    });
    test('read many', async () => {
      const many = await findManyNeo({ where: { label: tid } });
      expect(many?.data?.length || 0).toBe(0);
    });
  });
});

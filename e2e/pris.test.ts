import {
  createOnePris,
  deleteOnePris,
  updateOnePris,
} from './mutation/pris';
import { customAlphabet } from 'nanoid';
import { findManyPris, findOnePris } from './query/pris';
import { Types } from 'mongoose';

describe('create', () => {
  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 8);
  const data = {
    id: new Types.ObjectId(),
    string: nanoid(),
    date: new Date(),
    number: Date.now(),
  };

  beforeAll(async () => {
    await createOnePris({
      data,
    });
  });

  test('read one', async () => {
    const one = await findOnePris({
      index: { id: data.id },
      label: 'after create',
    });
    expect(one.id).toBe(data.id.toString());
    expect(one.string).toBe(data.string);
    expect(one.date).toBe(data.date.toISOString());
    expect(one.number).toBe(data.number);
  });

  test('read many', async () => {
    const many = await findManyPris({ where: { id: data.id } });
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
      await updateOnePris({
        data: { string: content },
        index: {
          id: data.id.toString(),
        },
      });
    });
    test('read', async () => {
      const after = await deleteOnePris({
        index: { id: data.id },
      });
      expect(after.string).toBe(content);
    });

    describe('delete', () => {
      beforeAll(async () => { });
      test('read', async () => {
        const one = await findOnePris({ index: { id: data.id } });
        expect(one).not.toBeTruthy();
      });
    });
  });
});

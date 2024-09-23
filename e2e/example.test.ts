import {
  createOneExample,
  deleteOneExample,
  updateOneExample,
} from './mutation/example';
import { customAlphabet } from 'nanoid';
import { findOneExample } from './query/example';
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

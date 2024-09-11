import { findManyMongo } from './query/mongo';

describe('mongo:filter', () => {
  test('user: paging mongos', async () => {
    let manyMongo: any,
      context = { where: {}, paging: { limit: 3, cursors: null } },
      hasNext = true,
      count = 0;

    const mongos = [];
    while ((manyMongo = hasNext && (await findManyMongo(context)))) {
      count = count + (manyMongo?.data?.length || 0);
      context.paging.cursors = manyMongo?.paging?.next;
      delete context.paging.cursors.count;

      hasNext = !!context.paging.cursors && count < 500;
      manyMongo?.data?.map((mongo: any) => mongos.push(mongo));
    }
    console.log(mongos.length);
    expect(mongos?.length).toBeGreaterThan(0);
  });
});

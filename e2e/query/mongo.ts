import { uri } from '@e2e/common/config';
import { gql, request } from 'graphql-request';

export async function findManyMongoCursor({ tid, sortBy }) {
  const limit = 3;
  let props = {
      where: { label: tid },
      paging: { limit, cursors: null },
      sortBy,
    },
    many: any,
    hasNext = true,
    mongos = [];
  while ((many = hasNext && (await findManyMongo(props)))) {
    const next = many?.paging?.next || {};
    mongos.push(...many.data);
    hasNext = next.count > 0;
    delete next.count;
    props.paging.cursors = next;
  }
  return mongos;
}

export async function findManyMongo(props?: any) {
  const { where, paging, search, sortBy } = props || {};
  delete paging?.count;
  const query = gql`
    query (
      $where: MongoWhereInputType
      $paging: PagingInput
      $search: String
      $sortBy: String
    ) {
      findManyMongo(
        where: $where
        paging: $paging
        search: $search
        sortBy: $sortBy
      ) {
        paging {
          count
          next {
            count
            after
          }
          previous {
            count
            before
          }
        }
        data {
          id
          string
          date
          number
        }
      }
    }
  `;

  const { findManyMongo: data } = await request<any>(uri, query, {
    where,
    paging,
    search,
    sortBy,
  });
  return data;
}

export async function findOneMongo(
  { index, label }: { index: any; label?: string },
  token?: string,
) {
  const { findOneMongo } = await request<any>(
    uri,
    gql`
      query ($index: MongoIndexInputType!, $label: String) {
        findOneMongo(index: $index, label: $label) {
          id
          string
          date
          number
        }
      }
    `,
    { index, label },
    { authorization: `Bearer ${token}` },
  );
  return findOneMongo;
}

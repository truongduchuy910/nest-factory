import { uri } from '@e2e/common/config';
import { gql, request } from 'graphql-request';

// public api
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

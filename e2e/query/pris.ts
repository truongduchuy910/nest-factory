import { uri } from '@e2e/common/config';
import { gql, request } from 'graphql-request';

export async function findManyPris(props?: any) {
  const { where, paging, search, sortBy } = props || {};
  delete paging?.count;
  const query = gql`
    query (
      $where: PrisWhereInputType
      $paging: PagingInput
      $search: String
      $sortBy: String
    ) {
      findManyPris(
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

  const { findManyPris: data } = await request<any>(uri, query, {
    where,
    paging,
    search,
    sortBy,
  });
  return data;
}

export async function findOnePris(
  { index, label }: { index: any; label?: string },
  token?: string,
) {
  const { findOnePris } = await request<any>(
    uri,
    gql`
      query ($index: PrisIndexInputType!, $label: String) {
        findOnePris(index: $index, label: $label) {
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
  return findOnePris;
}

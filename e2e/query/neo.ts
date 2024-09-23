import { uri } from '@e2e/common/config';
import { gql, request } from 'graphql-request';

export async function findManyNeoCursor({ tid, sortBy, limit = 3 }) {
  let props = {
      where: { label: tid },
      paging: { limit, cursors: null },
      sortBy,
    },
    many: any,
    hasNext = true,
    mongos = [];
  const lengths = [];
  while ((many = hasNext && (await findManyNeo(props)))) {
    const next = many?.paging?.next || {};
    mongos.push(...many.data);
    lengths.push(many.data.length);
    hasNext = next.count > 0;
    delete next.count;
    props.paging.cursors = next;
  }
  return mongos;
}

export async function findManyNeo(props?: any) {
  const { where, paging, search, sortBy } = props || {};
  delete paging?.count;
  const query = gql`
    query (
      $where: NeoWhereInputType
      $paging: PagingInput
      $search: String
      $sortBy: String
    ) {
      findManyNeo(
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

  const { findManyNeo: data } = await request<any>(uri, query, {
    where,
    paging,
    search,
    sortBy,
  });
  return data;
}

export async function findOneNeo(
  { index, label }: { index: any; label?: string },
  token?: string,
) {
  const { findOneNeo } = await request<any>(
    uri,
    gql`
      query ($index: NeoIndexInputType!, $label: String) {
        findOneNeo(index: $index, label: $label) {
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
  return findOneNeo;
}

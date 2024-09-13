import { uri } from '@e2e/common/config';
import { gql, request } from 'graphql-request';

export async function createOnePris({ data }, token?: string) {
  const { createOnePris } = await request<any>(
    uri,
    gql`
      mutation ($data: PrisCreateInputType!) {
        createOnePris(data: $data) {
          id
          string
          date
          number
        }
      }
    `,
    { data },
    { authorization: `Bearer ${token}` },
  );

  return createOnePris;
}

export async function updateOnePris({ data, index }, token?: string) {
  const { updateOnePris } = await request<any>(
    uri,
    gql`
      mutation ($data: PrisUpdateInputType!, $index: PrisIndexInputType!) {
        updateOnePris(data: $data, index: $index) {
          id
          string
          date
          number
        }
      }
    `,
    { data, index },
    { authorization: `Bearer ${token}` },
  );
  return updateOnePris;
}

export async function deleteOnePris({ index }, token?: string) {
  const { deleteOnePris } = await request<any>(
    uri,
    gql`
      mutation ($index: PrisIndexInputType!) {
        deleteOnePris(index: $index) {
          id
          string
          date
          number
        }
      }
    `,
    { index },
    { authorization: `Bearer ${token}` },
  );
  return deleteOnePris;
}

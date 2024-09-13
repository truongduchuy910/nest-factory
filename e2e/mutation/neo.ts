import { uri } from '@e2e/common/config';
import { gql, request } from 'graphql-request';

export async function createOneNeo({ data }, token?: string) {
  const { createOneNeo } = await request<any>(
    uri,
    gql`
      mutation ($data: NeoCreateInputType!) {
        createOneNeo(data: $data) {
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

  return createOneNeo;
}

export async function updateOneNeo({ data, index }, token?: string) {
  const { updateOneNeo } = await request<any>(
    uri,
    gql`
      mutation ($data: NeoUpdateInputType!, $index: NeoIndexInputType!) {
        updateOneNeo(data: $data, index: $index) {
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
  return updateOneNeo;
}

export async function deleteOneNeo({ index }, token?: string) {
  const { deleteOneNeo } = await request<any>(
    uri,
    gql`
      mutation ($index: NeoIndexInputType!) {
        deleteOneNeo(index: $index) {
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
  return deleteOneNeo;
}

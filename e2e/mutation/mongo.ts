import { uri } from '@e2e/common/config';
import { gql, request } from 'graphql-request';

export async function createManyMongo({ data }, token?: string) {
  const { createManyMongo } = await request<any>(
    uri,
    gql`
      mutation ($data: [MongoCreateInputType!]!) {
        createManyMongo(data: $data) {
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

  return createManyMongo;
}

export async function createOneMongo({ data }, token?: string) {
  const { createOneMongo } = await request<any>(
    uri,
    gql`
      mutation ($data: MongoCreateInputType!) {
        createOneMongo(data: $data) {
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

  return createOneMongo;
}

export async function updateOneMongo({ data, index }, token?: string) {
  const { updateOneMongo } = await request<any>(
    uri,
    gql`
      mutation ($data: MongoUpdateInputType!, $index: MongoIndexInputType!) {
        updateOneMongo(data: $data, index: $index) {
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
  return updateOneMongo;
}

export async function deleteOneMongo({ index }, token?: string) {
  const { deleteOneMongo } = await request<any>(
    uri,
    gql`
      mutation ($index: MongoIndexInputType!) {
        deleteOneMongo(index: $index) {
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
  return deleteOneMongo;
}

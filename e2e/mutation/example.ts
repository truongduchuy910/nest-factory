import { uri } from '@e2e/common/config';
import { gql, request } from 'graphql-request';

export async function createManyExample({ data }, token?: string) {
  data = data.map((i: any) => {
    delete i.id;
    return i;
  });
  const { createManyExample } = await request<any>(
    uri,
    gql`
      mutation ($data: [ExampleCreateInputType!]!) {
        createManyExample(data: $data)
      }
    `,
    { data },
    { authorization: `Bearer ${token}` },
  );

  return createManyExample;
}

export async function createOneExample({ data }, token?: string) {
  delete data.id;
  const { createOneExample } = await request<any>(
    uri,
    gql`
      mutation ($data: ExampleCreateInputType!) {
        createOneExample(data: $data) {
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

  return createOneExample;
}

export async function updateOneExample({ data, index }, token?: string) {
  const { updateOneExample } = await request<any>(
    uri,
    gql`
      mutation (
        $data: ExampleUpdateInputType!
        $index: ExampleIndexInputType!
      ) {
        updateOneExample(data: $data, index: $index) {
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
  return updateOneExample;
}

export async function deleteOneExample({ index }, token?: string) {
  const { deleteOneExample } = await request<any>(
    uri,
    gql`
      mutation ($index: ExampleIndexInputType!) {
        deleteOneExample(index: $index) {
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
  return deleteOneExample;
}

export async function deleteManyExample({ where }, token?: string) {
  const { deleteManyExample } = await request<any>(
    uri,
    gql`
      mutation ($where: ExampleWhereInputType) {
        deleteManyExample(where: $where)
      }
    `,
    { where },
    { authorization: `Bearer ${token}` },
  );
  return deleteManyExample;
}

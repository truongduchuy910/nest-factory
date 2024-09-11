import { ConfigModule, ConfigService } from '@nestjs/config';
import { GqlModuleAsyncOptions } from '@nestjs/graphql';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { ApolloFederationDriver } from '@nestjs/apollo';
import { join } from 'path';

export const graphqlOptions: GqlModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  driver: ApolloFederationDriver,
  useFactory: async (configService: ConfigService) => {
    return {
      playground: false,
      cors: configService.get('cors'),
      path: '/api/graphql',
      introspection: true,
      sortSchema: true,
      csrfPrevention: false,
      uploads: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      formatError: (error: GraphQLError) => {
        const graphQLFormattedError: GraphQLFormattedError = {
          message: error.message,
        };
        return graphQLFormattedError;
      },

      context: async ({ req, res }) => {
        return {};
      },
    };
  },
};

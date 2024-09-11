import { Neo4jModuleAsyncOptions } from 'nest-ogm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const neo4jConfig: Neo4jModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const uri = configService.get<string>('NEO4J_URI');
    const username = configService.get<string>('NEO4J_USERNAME');
    const password = configService.get<string>('NEO4J_PASSWORD');
    return {
      uri,
      username,
      password,
      typeDefs: [],
      options: {
        features: {
          filters: {
            Date: {
              LT: true,
              GT: true,
              LTE: false,
              GTE: false,
            },
            Number: {
              LT: true,
              GT: true,
              LTE: false,
              GTE: false,
            },
            String: {
              LT: true,
              GT: true,
              LTE: false,
              GTE: false,
            },
            ID: {
              LT: true,
              GT: true,
              LTE: false,
              GTE: false,
            },
          },
          populatedBy: {
            callbacks: {},
          },
        },
      },
    };
  },
};

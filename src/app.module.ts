import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';

import { configOptions } from './config/config';
import { mongooseOptions } from './config/mongoose';
import { graphqlOptions } from './config/graphql';
import { ConfigModule } from '@nestjs/config';
import { Neo4jModule } from 'nest-ogm';
import { neo4jConfig } from './config/neo4j';
import { NeoModule } from './neo/neo.module';
import { MongoModule } from './mongo/mongo.module';
import { PrisModule } from './pris/pris.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { ExampleModule } from './example/example.module';

@Module({
  imports: [
    ConfigModule.forRoot(configOptions),
    GraphQLModule.forRootAsync(graphqlOptions),
    MongooseModule.forRootAsync(mongooseOptions),
    Neo4jModule.forRootAsync(neo4jConfig),
    MongoModule,
    NeoModule,
    PrisModule,
    PrismaModule,
    ExampleModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

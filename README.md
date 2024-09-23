# nest-factory

Nest Factory - Build and release Nest modules. 🇻🇳

## Get started

Follow steps to run API:

1. Run databases `docker compose up -d`
2. Generate from examples `npm run gen`
3. Run NestJS Factory with `npm run start:dev`

Then, API endpoint `http://localhost:3000/api/graphql`

### MongoDB

You should change in `scripts/mongo/example` and run `npm run test:mongo`

Scripts `test:mongo` above will run as steps:

1. Copy source from `scripts/mongo/example` to `src/mongo` and replace all syntax inside example to a mongo.
2. Run test at `e2e/mongo.test.ts`

### Neo4

You should change in `scripts/neo/example` and run `npm run test:neo`

Scripts `test:neo` above will run as steps:

1. Copy source from `scripts/neo/example` to `src/neo` and replace all syntax inside example to a neo.
2. Run test at `e2e/neo.test.ts`

import { ConfigModuleOptions } from '@nestjs/config';
import * as Joi from 'joi';
import configuration from './configuration';

export const configOptions: ConfigModuleOptions = {
  load: [configuration],
  validationSchema: Joi.object({
    ['MODE']: Joi.required(),
    ['GRAPHQL_PORT']: Joi.required(),
    ['MONGO_CONNECTION']: Joi.required(),
  }),
  isGlobal: true,
};

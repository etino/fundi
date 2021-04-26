import Autoload, {AutoloadPluginOptions} from 'fastify-autoload';
import S from 'fluent-json-schema';
import * as fs from 'fs';
import { join } from 'path';
import { FastifyPluginAsync } from 'fastify';
import sensible from 'fastify-sensible'

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

declare module 'fastify' {
  interface FastifyInstance {
    config: { 
      NODE_ENV: string,
      JWT_SECRET: string,
    };
  }
}

const app: FastifyPluginAsync<AppOptions> = async function (fastify, opts): Promise<void> {
  await fastify.register(require('fastify-env'), {
    confKey: 'config',
    schema: S.object()
      .prop('NODE_ENV', S.string().default('development'))
      .prop('JWT_SECRET', S.string().required())
      .additionalProperties(true),
    dotenv: true,
  });

  const knexConfig = await require('../knexfile')[fastify.config.NODE_ENV];

  await fastify.register(require('fastify-objectionjs'), {
    knexConfig,
  });

  await fastify.register(sensible, {
    errorHandler: false
  });

  await fastify.register(Autoload, {
    dir: join(__dirname, 'plugins'),
    options: Object.assign({}, opts),
  });

  await fastify.register(Autoload, {
    dir: join(__dirname, 'services'),
    ignorePattern: /models/,
    options: Object.assign({}, opts),
    prefix: '/api',
  });

  fastify.get('/', async function (request, reply) {
    const index = fs.createReadStream('./index.html');
    reply.type('text/html').send(index);
  });
};

export default app;
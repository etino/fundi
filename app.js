'use strict';

const Autoload = require('fastify-autoload');
const S = require('fluent-json-schema');
const fs = require('fs');
const { join } = require('path');

module.exports = async function (app, opts) {
  await app.register(require('fastify-env'), {
    confKey: 'config',
    schema: S.object()
      .prop('NODE_ENV', S.string().default('development'))
      .prop('JWT_SECRET', S.string().required())
      .additionalProperties(true),
    dotenv: true,
  });

  const knexConfig = await require('./knexfile')[app.config.NODE_ENV];

  await app.register(require('fastify-objectionjs'), {
    knexConfig,
  });

  await app.register(require('fastify-sensible'));

  await app.register(Autoload, {
    dir: join(__dirname, 'plugins'),
    options: Object.assign({}, opts),
  });

  await app.register(Autoload, {
    dir: join(__dirname, 'services'),
    ignorePattern: /models/,
    options: Object.assign({}, opts),
    prefix: '/api',
  });

  app.get('/', async function (request, reply) {
    const index = fs.createReadStream('./index.html');
    reply.type('text/html').send(index);
  });
};

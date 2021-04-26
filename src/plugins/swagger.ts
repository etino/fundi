import fp from 'fastify-plugin';
import { FastifyPluginCallback } from 'fastify';
import { FastifyDynamicSwaggerOptions } from 'fastify-swagger';

// import { author } from '../../package.json';

const docsPluginOptions: FastifyDynamicSwaggerOptions = {
  routePrefix: '/documentation',
  exposeRoute: true, //app.config.NODE_ENV !== 'production',
  openapi: {
    info: {
      title: 'Fundi REST Api',
      description: 'REST Api Backend using Fastify',
      // contact: author,
      license: {
        name: 'Apache 2.0',
        url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
      },
      version: '1.0.0',
    },
    // host: 'localhost:3000',
    // basePath: '/',
    // schemes: ['http', 'https'],
    // consumes: ['application/json'],
    // produces: ['application/json'],
    tags: [
      {
        name: 'Auth',
        description: 'Operations about Authentication',
      },
    ],
    components: {
      securitySchemes: {
        ApiKey: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
}

const docsPlugin: FastifyPluginCallback = async (app, opts) => {
  await app.register(import('fastify-swagger'), docsPluginOptions);
}

export default fp(docsPlugin);

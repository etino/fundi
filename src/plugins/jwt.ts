import fp from 'fastify-plugin';
import fastifyJwt from 'fastify-jwt';
import { FastifyReply, FastifyRequest } from 'fastify'



export default fp(async function (app, opts) {
  app.register(fastifyJwt, {
    secret: app.config.JWT_SECRET,
  });

  app.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify();
    } catch (error) {
      reply.send(error);
    }
  });

  app.decorate('checkToken', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify({ ignoreExpiration: true });
    } catch (error) {
      reply.send(error);
    }
  });
});


declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => void,
    checkToken: (request: FastifyRequest, reply: FastifyReply) => void,
  }
}

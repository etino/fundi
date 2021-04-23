const fp = require('fastify-plugin');

module.exports = fp(async function (app, opts) {
  app.register(require('fastify-jwt'), {
    secret: app.config.JWT_SECRET,
  });

  app.decorate('authenticate', async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch (error) {
      reply.send(error);
    }
  });

  app.decorate('checkToken', async function (request, reply) {
    try {
      await request.jwtVerify({ ignoreExpiration: true });
    } catch (error) {
      reply.send(error);
    }
  });
});

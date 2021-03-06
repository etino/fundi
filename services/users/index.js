'use strict';

const S = require('fluent-json-schema');

module.exports = async function (app, opts) {
  await app.register(require('./service'));

  const { httpErrors } = app;

  app.route({
    method: 'GET',
    url: '/test',
    handler: onTest,
  });

  async function onTest(request, reply) {
    const user = await app.userService.getUserByEmail('guest@test.com');
    return { message: 'Test - OK', user };
  }

  app.route({
    method: 'POST',
    url: '/signup',
    schema: {
      description: 'Signup',
      summary: 'User Signup',
      tags: ['User'],
      body: S.object()
        .prop('email', S.string().required())
        .prop('password', S.string().required())
        .additionalProperties(false),
      response: {
        200: S.object().prop('message', S.string()),
        401: S.object().prop('message', S.string()),
      },
    },
    handler: onSignup,
  });

  async function onSignup(request, reply) {
    const { email, password } = request.body;

    const user = await app.userService.getUserByEmail(email);
    if (user) {
      throw httpErrors.conflict('User already registered');
    }

    const newUser = await app.userService.createUser({ email, password });
    app.log.info(`User ${newUser.email} created with id ${newUser.id}`);
    return { message: 'User created' };
  }

  app.route({
    method: 'POST',
    url: '/login',
    schema: {
      description: 'Login',
      summary: 'User Login',
      tags: ['User'],
      body: S.object()
        .prop('email', S.string().required())
        .prop('password', S.string().required())
        .additionalProperties(false),
      response: {
        200: S.object()
          .prop('id', S.integer())
          .prop('accessToken', S.string())
          .prop('refreshToken', S.string()),
        401: S.object().prop('message', S.string()),
      },
    },
    handler: async function onLogin(request, reply) {
      const { email, password } = request.body;

      const user = await app.userService.getUserByEmailWithRoles(email);
      if (!user) {
        throw httpErrors.unauthorized();
      }

      const checkPassword = await user.verifyPassword(password);
      if (!checkPassword) {
        throw httpErrors.unauthorized();
      }

      const clientData = {
        userAgent: request.headers['user-agent'],
        remoteIp: request.connection.remoteAddress,
      };

      const { id, roles } = user;

      const { token: refreshToken } = await app.userService.getNewRefreshToken(
        id,
        clientData
      );

      const accessToken = await app.jwt.sign({ id, roles });

      return { id, accessToken, refreshToken };
    },
  });

  app.route({
    method: 'POST',
    url: '/refresh',
    preValidation: [app.checkToken],
    schema: {
      description: 'Refresh',
      summary: 'Refresh Token',
      tags: ['User'],
      body: S.object()
        .prop('refreshToken', S.string().required())
        .additionalProperties(false),
      response: {
        200: S.object().prop('id', S.integer()).prop('accessToken', S.string()),
        401: S.object().prop('message', S.string()),
      },
      security: [{ ApiKey: [] }],
    },
    handler: async function onRefresh(request, reply) {
      const { refreshToken } = request.body;

      const { id, roles } = request.user;
      const checkRefreshToken = await app.userService.checkRefreshToken(
        id,
        refreshToken
      );
      if (!checkRefreshToken) {
        throw httpErrors.unauthorized();
      }

      const accessToken = await app.jwt.sign({ id, roles });

      return { id, accessToken };
    },
  });

  app.route({
    method: 'POST',
    url: '/logout',
    preValidation: [app.checkToken],
    schema: {
      description: 'Logout',
      summary: 'Logout',
      tags: ['User'],
      body: S.object()
        .prop('refreshToken', S.string().required())
        .additionalProperties(false),
      response: {
        200: S.object().prop('message', S.string()),
        401: S.object().prop('message', S.string()),
      },
      security: [{ ApiKey: [] }],
    },
    handler: async function onLogout(request, reply) {
      const { refreshToken } = request.body;

      const { id } = request.user;
      const checkRefreshToken = await app.userService.checkRefreshToken(
        id,
        refreshToken
      );
      if (!checkRefreshToken) {
        throw httpErrors.unauthorized();
      }

      const result = await app.userService.deleteRefreshToken(id, refreshToken);

      if (!result) {
        throw httpErrors.unauthorized();
      }

      return { message: 'Logout executed' };
    },
  });
};

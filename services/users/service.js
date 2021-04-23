const fp = require('fastify-plugin');

module.exports = fp(async function userService(app, opts) {
  const User = require('./models/User.js');
  const RefreshToken = require('./models/RefreshToken.js');

  async function getUserByEmail(email) {
    const user = await User.query().findOne({ email });
    return user;
  }

  const getUserByEmailWithRoles = async function (email) {
    return await User.query().withGraphJoined('[roles]').findOne({ email });
  };

  const createUser = async ({ email, password }) => {
    return await User.query().insert({
      email,
      password,
    });
  };

  const updateUser = async (id, payload) => {
    return await User.query().patchAndFetchById(id, payload).debug();
  };

  const deleteUserById = async (id) => {
    return await User.query().deleteById(id);
  };

  const getNewRefreshToken = async (userId, clientData) => {
    return await User.relatedQuery('refreshTokens')
      .for(userId)
      .insert({ clientData });
  };

  const checkRefreshToken = async (userId, refreshToken) => {
    const result = await User.relatedQuery('refreshTokens')
      .for(userId)
      .findOne({ token: refreshToken });
    return result instanceof RefreshToken;
  };

  const deleteRefreshToken = async (userId, refreshToken) => {
    return await User.relatedQuery('refreshTokens')
      .for(userId)
      .delete()
      .where('token', refreshToken);
  };

  app.decorate('userService', {
    getUserByEmail,
    getUserByEmailWithRoles,
    createUser,
    updateUser,
    deleteUserById,
    getNewRefreshToken,
    checkRefreshToken,
    deleteRefreshToken,
  });
});

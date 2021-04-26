import fp from 'fastify-plugin';

import User from './models/User';
import RefreshToken from './models/RefreshToken'

export default fp(async function userService(app, opts) {

  async function getUserByEmail(email: string) {
    const user = await User.query().findOne({ email });
    return user;
  }

  const getUserByEmailWithRoles = async function (email: string) {
    return await User.query().withGraphJoined('[roles]').findOne({ email });
  };

  const createUser = async ({ email, password } : {email: string, password: string}) => {
    return await User.query().insert({
      email,
      password,
    });
  };

  const updateUser = async (id: string, payload: object) => {
    return await User.query().patchAndFetchById(id, payload).debug();
  };

  const deleteUserById = async (id: string) => {
    return await User.query().deleteById(id);
  };

  const getNewRefreshToken = async (userId: number, clientData: object) => {
    return await User.relatedQuery('refreshTokens')
      .for(userId)
      .insert(clientData);
  };

  const checkRefreshToken = async (userId: number, refreshToken: string) => {
    const result = await User.relatedQuery('refreshTokens')
      .for(userId)
      .findOne({ token: refreshToken });
    return result instanceof RefreshToken;
  };

  const deleteRefreshToken = async (userId: number, refreshToken: string) => {
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

declare module 'fastify' {
  export interface FastifyInstance {
    userService: {
      getUserByEmail: (email: string) => User,
      getUserByEmailWithRoles: (email: string) => User,
      createUser: (object: {email: string, password: string}) => User,
      updateUser: (id: string, payload: object) => User,
      deleteUserById: (id: string) => User,
      getNewRefreshToken: (userId: number, clientData: object) => RefreshToken,
      checkRefreshToken: (userId: number, refreshToken: string) => boolean,
      deleteRefreshToken: (userId: number, refreshToken: string) => RefreshToken,
    }
  }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = require("fastify-plugin");
const User_1 = require("./models/User");
const RefreshToken_1 = require("./models/RefreshToken");
exports.default = fastify_plugin_1.default(async function userService(app, opts) {
    async function getUserByEmail(email) {
        const user = await User_1.default.query().findOne({ email });
        return user;
    }
    const getUserByEmailWithRoles = async function (email) {
        return await User_1.default.query().withGraphJoined('[roles]').findOne({ email });
    };
    const createUser = async ({ email, password }) => {
        return await User_1.default.query().insert({
            email,
            password,
        });
    };
    const updateUser = async (id, payload) => {
        return await User_1.default.query().patchAndFetchById(id, payload).debug();
    };
    const deleteUserById = async (id) => {
        return await User_1.default.query().deleteById(id);
    };
    const getNewRefreshToken = async (userId, clientData) => {
        return await User_1.default.relatedQuery('refreshTokens')
            .for(userId)
            .insert(clientData);
    };
    const checkRefreshToken = async (userId, refreshToken) => {
        const result = await User_1.default.relatedQuery('refreshTokens')
            .for(userId)
            .findOne({ token: refreshToken });
        return result instanceof RefreshToken_1.default;
    };
    const deleteRefreshToken = async (userId, refreshToken) => {
        return await User_1.default.relatedQuery('refreshTokens')
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

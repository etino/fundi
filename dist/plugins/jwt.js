"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = require("fastify-plugin");
const fastify_jwt_1 = require("fastify-jwt");
exports.default = fastify_plugin_1.default(async function (app, opts) {
    app.register(fastify_jwt_1.default, {
        secret: app.config.JWT_SECRET,
    });
    app.decorate('authenticate', async function (request, reply) {
        try {
            await request.jwtVerify();
        }
        catch (error) {
            reply.send(error);
        }
    });
    app.decorate('checkToken', async function (request, reply) {
        try {
            await request.jwtVerify({ ignoreExpiration: true });
        }
        catch (error) {
            reply.send(error);
        }
    });
});

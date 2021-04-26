"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_autoload_1 = require("fastify-autoload");
const fluent_json_schema_1 = require("fluent-json-schema");
const fs = require("fs");
const path_1 = require("path");
const fastify_sensible_1 = require("fastify-sensible");
const app = async function (fastify, opts) {
    await fastify.register(require('fastify-env'), {
        confKey: 'config',
        schema: fluent_json_schema_1.default.object()
            .prop('NODE_ENV', fluent_json_schema_1.default.string().default('development'))
            .prop('JWT_SECRET', fluent_json_schema_1.default.string().required())
            .additionalProperties(true),
        dotenv: true,
    });
    const knexConfig = await require('../knexfile')[fastify.config.NODE_ENV];
    await fastify.register(require('fastify-objectionjs'), {
        knexConfig,
    });
    await fastify.register(fastify_sensible_1.default, {
        errorHandler: false
    });
    await fastify.register(fastify_autoload_1.default, {
        dir: path_1.join(__dirname, 'plugins'),
        options: Object.assign({}, opts),
    });
    await fastify.register(fastify_autoload_1.default, {
        dir: path_1.join(__dirname, 'services'),
        ignorePattern: /models/,
        options: Object.assign({}, opts),
        prefix: '/api',
    });
    fastify.get('/', async function (request, reply) {
        const index = fs.createReadStream('./index.html');
        reply.type('text/html').send(index);
    });
};
exports.default = app;

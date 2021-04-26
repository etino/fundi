"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = require("fastify-plugin");
const docsPluginOptions = {
    routePrefix: '/documentation',
    exposeRoute: true,
    openapi: {
        info: {
            title: 'Fundi REST Api',
            description: 'REST Api Backend using Fastify',
            license: {
                name: 'Apache 2.0',
                url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
            },
            version: '1.0.0',
        },
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
};
const docsPlugin = async (app, opts) => {
    await app.register(Promise.resolve().then(() => require('fastify-swagger')), docsPluginOptions);
};
exports.default = fastify_plugin_1.default(docsPlugin);

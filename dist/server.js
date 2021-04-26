'use strict';
exports.__esModule = true;
// Read the .env file.
require('dotenv').config();
// Require the framework
var fastify_1 = require("fastify");
// Instantiate Fastify with some config
var app = fastify_1["default"]({
    logger: true,
    pluginTimeout: 10000
});
// Register your application as a normal plugin.
app.register(require('./app.js'));
// Start listening.
app.listen(process.env.PORT || 3000, function (err) {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
});

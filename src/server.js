'use strict';

// Read the .env file.
require('dotenv').config();

// Require the framework
import Fastify from 'fastify';

// Instantiate Fastify with some config
const app = Fastify({
  logger: true,
  pluginTimeout: 10000,
});

// Register your application as a normal plugin.
app.register(require('./app.js'));

// Start listening.
app.listen(process.env.PORT || 3000, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});

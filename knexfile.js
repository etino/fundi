const { knexSnakeCaseMapper } = require('objection');
const { join } = require('path');

// const debug = process.env.NODE_ENV !== 'production';
const debug = false;

module.exports = {
  development: {
    client: 'sqlite3',
    debug,
    connection: {
      filename: './data/dev.sqlite3',
    },
    useNullAsDefault: true,
    migrations: {
      directory: join(__dirname, 'database/migrations'),
    },
    seeds: {
      directory: join(__dirname, 'database/seeds'),
    },
    ...knexSnakeCaseMapper,
  },
};

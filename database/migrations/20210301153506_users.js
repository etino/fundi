function users(table) {
  table.increments();
  table.string('email', 128).notNullable().index().unique();
  table.string('password', 64).notNullable();
  table.timestamps(true, true);
}

function roles(table) {
  table.increments('id');
  table.string('name');
}

// eslint-disable-next-line camelcase
function users_roles(table) {
  table.increments('id');
  table
    .integer('user_id')
    .unsigned()
    .notNullable()
    .references('id')
    .inTable('users');
  table
    .integer('role_id')
    .unsigned()
    .notNullable()
    .references('id')
    .inTable('roles');
}

// eslint-disable-next-line camelcase
function refresh_tokens(table) {
  table.increments('id');
  table
    .integer('user_id')
    .unsigned()
    .notNullable()
    .references('id')
    .inTable('users');
  table.string('token').notNullable().index().unique();
  table.timestamp('expiration_date').notNullable();
  table.string('client_data');
  table.boolean('is_blacklisted').notNullable().defaultTo(false);
  table.timestamps(true, true);
}

exports.up = async function (knex) {
  await knex.schema.createTable('users', users);
  await knex.schema.createTable('roles', roles);
  await knex.schema.createTable('users_roles', users_roles);
  await knex.schema.createTable('refresh_tokens', refresh_tokens);
};

exports.down = async function (knex) {
  knex.raw('SET foreign_key_checks = 0;');
  await Promise.all([
    knex.schema.dropTableIfExists('users'),
    knex.schema.dropTableIfExists('roles'),
    knex.schema.dropTableIfExists('users_roles'),
    knex.schema.dropTableIfExists('refresh_tokens'),
  ]);
  knex.raw('SET foreign_key_checks = 1;');
};

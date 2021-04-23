const bcrypt = require('bcrypt');

const password = 'demo';
const hash = bcrypt.hashSync(password, 12);

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  await knex('users_roles').del();
  await knex('users').insert([
    {
      id: 1,
      email: 'guest@test.com',
      password: hash,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 2,
      email: 'admin@test.com',
      password: hash,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 3,
      email: 'superadmin@test.com',
      password: hash,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);

  await knex('roles').del();
  await knex('roles').insert([
    { id: 1, name: 'guest' },
    { id: 2, name: 'admin' },
    { id: 3, name: 'superadmin' },
  ]);

  await knex('users_roles').del();
  await knex('users_roles').insert([
    { user_id: 1, role_id: 1 },
    { user_id: 2, role_id: 2 },
    { user_id: 3, role_id: 3 },
  ]);
};

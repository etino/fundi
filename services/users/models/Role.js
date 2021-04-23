'use strict';

const S = require('fluent-json-schema');
const { Model } = require('objection');

class Role extends Model {
  static get tableName() {
    return 'roles';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return S.object()
      .prop('name', S.string().minLength(1).maxLength(255).required())
      .valueOf();
  }

  static get relationMappings() {
    const User = require('./User');
    return {
      users: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: 'roles.id',
          through: {
            from: 'users_roles.role_id',
            to: 'users_roles.user_id',
          },
          to: 'users.id',
        },
      },
    };
  }

  async $beforeInsert() {
    this.created_at = this.updated_at = new Date().toISOString();
  }

  async $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }
}

module.exports = Role;

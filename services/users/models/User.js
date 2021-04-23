'use strict';

const Password = require('objection-password')();
const { Model } = require('objection');
const S = require('fluent-json-schema');

class User extends Password(Model) {
  static get tableName() {
    return 'users';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return S.object()
      .prop('id', S.integer())
      .prop('email', S.string().minLength(1).maxLength(255).required())
      .prop('password', S.string().minLength(1).maxLength(255).required())
      .valueOf();
  }

  static get relationMappings() {
    const Role = require('./Role');
    const RefreshToken = require('./RefreshToken');
    return {
      roles: {
        relation: Model.ManyToManyRelation,
        modelClass: Role,
        join: {
          from: 'users.id',
          through: {
            from: 'users_roles.user_id',
            to: 'users_roles.role_id',
          },
          to: 'roles.id',
        },
      },
      refreshTokens: {
        relation: Model.HasManyRelation,
        modelClass: RefreshToken,
        join: {
          from: 'users.id',
          to: 'refresh_tokens.user_id',
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

module.exports = User;

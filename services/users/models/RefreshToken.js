'use strict';

const S = require('fluent-json-schema');
const addDays = require('date-fns/addDays');
const randtoken = require('rand-token');
const { Model } = require('objection');

class RefreshToken extends Model {
  static get tableName() {
    return 'refresh_tokens';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return S.object()
      .prop('id', S.integer())
      .prop('userId', S.integer())
      .prop('token', S.string())
      .prop(
        'clientData',
        S.object()
          .prop('userAgent', S.string())
          .prop('remoteIp', S.string())
          .valueOf()
      )
      .prop('isBlacklisted', S.boolean())
      .valueOf();
  }

  static get relationMappings() {
    const User = require('./User');
    return {
      users: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'refresh_tokens.user_id',
          to: 'users.id',
        },
      },
    };
  }

  async $beforeInsert() {
    this.isBlacklisted = false;
    this.token = randtoken.suid(255);
    const date = new Date();
    this.created_at = this.updated_at = date.toISOString();
    this.expirationDate = addDays(date, 30).toISOString();
  }

  async $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }
}

module.exports = RefreshToken;

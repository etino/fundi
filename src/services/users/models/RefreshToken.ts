import S from 'fluent-json-schema';
import addDays from 'date-fns/addDays';
import * as randtoken from 'rand-token';
import { Model } from 'objection';
import User from './User'

class RefreshToken extends Model {
  id!: number
  user?: User
  token?: string
  expirationDate?: string
  clientData?: object
  isBlacklisted?: boolean
  created_at?: string
  updated_at?: string

  static tableName = 'refresh_tokens';

  static idColumn = 'id';

  static jsonSchema = S.object()
      .prop('id', S.integer())
      .prop('userId', S.integer())
      .prop('token', S.string())
      .prop(
        'clientData',
        S.object()
          .prop('userAgent', S.string())
          .prop('remoteIp', S.string())
      )
      .prop('isBlacklisted', S.boolean())
      .valueOf();

  static relationMappings = () => ({
    users: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'refresh_tokens.user_id',
        to: 'users.id',
      },
    },
  })

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

export default RefreshToken;

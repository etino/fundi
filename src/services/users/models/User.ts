import { Model } from 'objection';
import S from 'fluent-json-schema';
import * as bcrypt from 'bcrypt';

import RefreshToken from './RefreshToken';
import Role from './Role';

const RECOMMENDED_ROUNDS = 12
const BCRYPT_HASH_REGEX = /^\$2[ayb]\$[0-9]{2}\$[A-Za-z0-9./]{53}$/

class User extends Model {
  id!: number
  email!: string
  password!: string
  created_at?: string
  updated_at?: string
  roles?: Role[]

  static tableName = 'users';

  static idColumn = 'id'

  static jsonSchema = S.object()
      .prop('id', S.integer())
      .prop('email', S.string().minLength(1).maxLength(255).required())
      .prop('password', S.string().minLength(1).maxLength(255).required())
      .valueOf();

  static relationMappings = () => ({
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
  })

  async $beforeInsert() {
    this.created_at = this.updated_at = new Date().toISOString();
    return await this.generateHash()
  }

  async $beforeUpdate() {
    this.updated_at = new Date().toISOString();
    return await this.generateHash()
  }

  // Compares a password to a bcrypt hash, returns whether or not the password was verified.
  async verifyPassword (password: string) {
    return await bcrypt.compare(password, this.password)
  }

  async generateHash() {
    const password = this.password

    if (password) {
      if (User.isBcryptHash(password)) {
        throw new Error('bcrypt tried to hash another bcrypt hash')
      }
      const hash = await bcrypt.hash(password, RECOMMENDED_ROUNDS)
      this.password = hash

      return hash
    }
  }

  /* Detect rehashing to avoid undesired effects.
    * Returns true if the string seems to be a bcrypt hash. */
  static isBcryptHash (str: string) {
    return BCRYPT_HASH_REGEX.test(str)
  }


}

export default User;

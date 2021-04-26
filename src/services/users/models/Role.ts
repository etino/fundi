import S from 'fluent-json-schema';
import { Model } from 'objection';

import User from './User';

class Role extends Model {
  id!: number
  name!: string
  created_at?: string
  updated_at?: string

  static tableName = 'roles'
  
  static idColumn = 'id'

  static jsonSchema = S.object()
      .prop('name', S.string().minLength(1).maxLength(255).required())
      .valueOf();

  static relationMappings = () => ({
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
  })

  async $beforeInsert() {
    this.created_at = this.updated_at = new Date().toISOString();
  }

  async $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }
}

export default Role;

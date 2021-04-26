"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fluent_json_schema_1 = require("fluent-json-schema");
const objection_1 = require("objection");
const User_1 = require("./User");
class Role extends objection_1.Model {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "created_at", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "updated_at", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    async $beforeInsert() {
        this.created_at = this.updated_at = new Date().toISOString();
    }
    async $beforeUpdate() {
        this.updated_at = new Date().toISOString();
    }
}
Object.defineProperty(Role, "tableName", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'roles'
});
Object.defineProperty(Role, "idColumn", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'id'
});
Object.defineProperty(Role, "jsonSchema", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: fluent_json_schema_1.default.object()
        .prop('name', fluent_json_schema_1.default.string().minLength(1).maxLength(255).required())
        .valueOf()
});
Object.defineProperty(Role, "relationMappings", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: () => ({
        users: {
            relation: objection_1.Model.ManyToManyRelation,
            modelClass: User_1.default,
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
});
exports.default = Role;

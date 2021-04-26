"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
const fluent_json_schema_1 = require("fluent-json-schema");
const bcrypt = require("bcrypt");
const RefreshToken_1 = require("./RefreshToken");
const Role_1 = require("./Role");
const RECOMMENDED_ROUNDS = 12;
const BCRYPT_HASH_REGEX = /^\$2[ayb]\$[0-9]{2}\$[A-Za-z0-9./]{53}$/;
class User extends objection_1.Model {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "email", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "password", {
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
        Object.defineProperty(this, "roles", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    async $beforeInsert() {
        this.created_at = this.updated_at = new Date().toISOString();
        return await this.generateHash();
    }
    async $beforeUpdate() {
        this.updated_at = new Date().toISOString();
        return await this.generateHash();
    }
    async verifyPassword(password) {
        return await bcrypt.compare(password, this.password);
    }
    async generateHash() {
        const password = this.password;
        if (password) {
            if (User.isBcryptHash(password)) {
                throw new Error('bcrypt tried to hash another bcrypt hash');
            }
            const hash = await bcrypt.hash(password, RECOMMENDED_ROUNDS);
            this.password = hash;
            return hash;
        }
    }
    static isBcryptHash(str) {
        return BCRYPT_HASH_REGEX.test(str);
    }
}
Object.defineProperty(User, "tableName", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'users'
});
Object.defineProperty(User, "idColumn", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'id'
});
Object.defineProperty(User, "jsonSchema", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: fluent_json_schema_1.default.object()
        .prop('id', fluent_json_schema_1.default.integer())
        .prop('email', fluent_json_schema_1.default.string().minLength(1).maxLength(255).required())
        .prop('password', fluent_json_schema_1.default.string().minLength(1).maxLength(255).required())
        .valueOf()
});
Object.defineProperty(User, "relationMappings", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: () => ({
        roles: {
            relation: objection_1.Model.ManyToManyRelation,
            modelClass: Role_1.default,
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
            relation: objection_1.Model.HasManyRelation,
            modelClass: RefreshToken_1.default,
            join: {
                from: 'users.id',
                to: 'refresh_tokens.user_id',
            },
        },
    })
});
exports.default = User;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fluent_json_schema_1 = require("fluent-json-schema");
const addDays_1 = require("date-fns/addDays");
const randtoken = require("rand-token");
const objection_1 = require("objection");
const User_1 = require("./User");
class RefreshToken extends objection_1.Model {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "user", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "token", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "expirationDate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "clientData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isBlacklisted", {
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
        this.isBlacklisted = false;
        this.token = randtoken.suid(255);
        const date = new Date();
        this.created_at = this.updated_at = date.toISOString();
        this.expirationDate = addDays_1.default(date, 30).toISOString();
    }
    async $beforeUpdate() {
        this.updated_at = new Date().toISOString();
    }
}
Object.defineProperty(RefreshToken, "tableName", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'refresh_tokens'
});
Object.defineProperty(RefreshToken, "idColumn", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'id'
});
Object.defineProperty(RefreshToken, "jsonSchema", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: fluent_json_schema_1.default.object()
        .prop('id', fluent_json_schema_1.default.integer())
        .prop('userId', fluent_json_schema_1.default.integer())
        .prop('token', fluent_json_schema_1.default.string())
        .prop('clientData', fluent_json_schema_1.default.object()
        .prop('userAgent', fluent_json_schema_1.default.string())
        .prop('remoteIp', fluent_json_schema_1.default.string()))
        .prop('isBlacklisted', fluent_json_schema_1.default.boolean())
        .valueOf()
});
Object.defineProperty(RefreshToken, "relationMappings", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: () => ({
        users: {
            relation: objection_1.Model.BelongsToOneRelation,
            modelClass: User_1.default,
            join: {
                from: 'refresh_tokens.user_id',
                to: 'users.id',
            },
        },
    })
});
exports.default = RefreshToken;

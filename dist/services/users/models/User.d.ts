import { Model } from 'objection';
import RefreshToken from './RefreshToken';
import Role from './Role';
declare class User extends Model {
    id: number;
    email: string;
    password: string;
    created_at?: string;
    updated_at?: string;
    roles?: Role[];
    static tableName: string;
    static idColumn: string;
    static jsonSchema: Object;
    static relationMappings: () => {
        roles: {
            relation: import("objection").RelationType;
            modelClass: typeof Role;
            join: {
                from: string;
                through: {
                    from: string;
                    to: string;
                };
                to: string;
            };
        };
        refreshTokens: {
            relation: import("objection").RelationType;
            modelClass: typeof RefreshToken;
            join: {
                from: string;
                to: string;
            };
        };
    };
    $beforeInsert(): Promise<string | undefined>;
    $beforeUpdate(): Promise<string | undefined>;
    verifyPassword(password: string): Promise<boolean>;
    generateHash(): Promise<string | undefined>;
    static isBcryptHash(str: string): boolean;
}
export default User;

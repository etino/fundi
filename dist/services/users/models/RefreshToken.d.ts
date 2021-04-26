import { Model } from 'objection';
import User from './User';
declare class RefreshToken extends Model {
    id: number;
    user?: User;
    token?: string;
    expirationDate?: string;
    clientData?: object;
    isBlacklisted?: boolean;
    created_at?: string;
    updated_at?: string;
    static tableName: string;
    static idColumn: string;
    static jsonSchema: Object;
    static relationMappings: () => {
        users: {
            relation: import("objection").RelationType;
            modelClass: typeof User;
            join: {
                from: string;
                to: string;
            };
        };
    };
    $beforeInsert(): Promise<void>;
    $beforeUpdate(): Promise<void>;
}
export default RefreshToken;

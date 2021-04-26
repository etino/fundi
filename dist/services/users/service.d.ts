/// <reference types="node" />
import User from './models/User';
import RefreshToken from './models/RefreshToken';
declare const _default: import("fastify").FastifyPluginAsync<unknown, import("http").Server>;
export default _default;
declare module 'fastify' {
    interface FastifyInstance {
        userService: {
            getUserByEmail: (email: string) => User;
            getUserByEmailWithRoles: (email: string) => User;
            createUser: (object: {
                email: string;
                password: string;
            }) => User;
            updateUser: (id: string, payload: object) => User;
            deleteUserById: (id: string) => User;
            getNewRefreshToken: (userId: number, clientData: object) => RefreshToken;
            checkRefreshToken: (userId: number, refreshToken: string) => boolean;
            deleteRefreshToken: (userId: number, refreshToken: string) => RefreshToken;
        };
    }
}

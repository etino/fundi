import { AutoloadPluginOptions } from 'fastify-autoload';
import { FastifyPluginAsync } from 'fastify';
export declare type AppOptions = {} & Partial<AutoloadPluginOptions>;
declare module 'fastify' {
    interface FastifyInstance {
        config: {
            NODE_ENV: string;
            JWT_SECRET: string;
        };
    }
}
declare const app: FastifyPluginAsync<AppOptions>;
export default app;

/// <reference types="node" />
declare const _default: import("fastify").FastifyPluginAsync<unknown, import("http").Server>;
export default _default;
declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => void;
        checkToken: (request: FastifyRequest, reply: FastifyReply) => void;
    }
}

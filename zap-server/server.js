"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const websocket_1 = __importDefault(require("@fastify/websocket"));
const server = (0, fastify_1.default)();
// server.get('/ping', async (request, reply) => {
// 	return 'pong\n';
// });
const PING = 'PING';
const PONG = 'PONG';
console.log(`initialize server!`);
server.register(websocket_1.default, {
    options: {
        maxPayload: 1048576, // TODO: what size for max payload?
    },
});
server.register(async function (fastify) {
    fastify.get('/*', { websocket: true }, (
    /* SocketStream */
    connection, 
    /* FastifyRequest */
    req) => {
        connection.socket.on('message', message => {
            // message.toString() === 'hi from client'
            connection.socket.send('hi from wildcard route');
        });
    });
    fastify.get('/', { websocket: true }, (
    /* SocketStream */
    connection, 
    /* FastifyRequest */
    req) => {
        connection.socket.on('message', message => {
            // message.toString() === 'hi from client'
            connection.socket.send('hi from server');
        });
    });
});
server.listen({ port: 3000 }, (err, address) => {
    if (err) {
        server.log.error(err);
        process.exit(1);
    }
    console.log(`Server listening at: ${address}`);
});

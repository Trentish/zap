import { ZapServer } from './src/ZapServer.js';
console.log(` `);
console.log(` `);
console.log(`_____________________________`);
console.log(`--- START -------------------`);
const wsHost = process.env.HOST || '0.0.0.0';
const wsPort = process.env.PORT ? parseInt(process.env.PORT) : 3007;
const zapServer = new ZapServer(wsHost, wsPort);
// import fastify from 'fastify';
// import websocket from '@fastify/websocket';
// import {ClientOptions} from 'ws';
//
// const fastifyInstance = fastify();
//
// console.log(`initialize server!`);
//
// const wsOptions: ClientOptions = {
// 	maxPayload: 1048576, // TODO: what size for max payload?
// };
//
// fastifyInstance.register(websocket, {options: wsOptions});
//
// fastifyInstance.register(
// 	async function (fastify) {
// 		fastify.get(
// 			'/',
// 			{websocket: true},
// 			(connection) => {
// 				zapServer.OnNewConnection(connection.socket);
// 			},
// 		);
// 	});
//
// fastifyInstance.listen({port: PORT}, (err, address) => {
// 	if (err) {
// 		fastifyInstance.log.error(err);
// 		process.exit(1);
// 	}
// 	console.log(`Server listening at: ${address}`);
// });

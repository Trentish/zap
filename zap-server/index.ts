import fastify from 'fastify';
import websocket from '@fastify/websocket';

const server = fastify();

// server.get('/ping', async (request, reply) => {
// 	return 'pong\n';
// });
const PING = 'PING';
const PONG = 'PONG';


server.register(
	websocket,
	{
		options: {
			maxPayload: 1048576, // TODO: what size for max payload?
		},
	},
);

server.register(
	async function (fastify) {
		fastify.get(
			'/*',
			{websocket: true},
			(
				/* SocketStream */
				connection,
				/* FastifyRequest */
				req,
			) => {
				connection.socket.on('message', message => {
					// message.toString() === 'hi from client'
					connection.socket.send('hi from wildcard route');
				});
			},
		);
		
		fastify.get(
			'/',
			{websocket: true},
			(
				/* SocketStream */
				connection,
				/* FastifyRequest */
				req,
			) => {
				connection.socket.on('message', message => {
					// message.toString() === 'hi from client'
					connection.socket.send('hi from server');
				});
			},
		);
	});

server.listen({port: 3000}, (err, address) => {
	if (err) {
		server.log.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}!`);
});
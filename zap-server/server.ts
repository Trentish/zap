import {ZapServer} from './src/ZapServer.js';

console.log(` `);
console.log(` `);
console.log(`_____________________________`);
console.log(`--- START -------------------`);
const wsHost = process.env.HOST || '0.0.0.0';
const wsPort = process.env.PORT ? parseInt(process.env.PORT) : 3007;
const storagePath = process.env.STORAGE_PATH || 'C:/Zap';
const zapServer = new ZapServer(wsHost, wsPort, storagePath);
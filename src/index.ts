import fastify from 'fastify';
import dotenv from 'dotenv';
import './certs/generate-keys.ts';
import { authRoutes } from './routes/auth.routes.ts';
import prismaPlugin from './plugins/prisma.ts';
import errorHandlerPlugin from './plugins/error-handler.ts';

dotenv.config();

const server = fastify({
    logger: true
});

// register prisma field
await server.register(prismaPlugin);

// Register Error Handler
await server.register(errorHandlerPlugin);

// add router with prefix
const PORT = Number(process.env.PORT) || 8081;
const PREFIX = process.env.API_PREFIX || 'auth/api';
server.register(authRoutes, { prefix: `/${PREFIX}` });

const start = async () => {
    try {
        await server.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`[auth-service]: Pure Fastify running on http://localhost:${PORT}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();

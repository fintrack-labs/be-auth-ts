import fastify from 'fastify';
import dotenv from 'dotenv';
import './certs/generate-keys.ts';
import { authRoutes } from './routes/auth.routes.ts';
import prismaPlugin from './plugins/prisma.ts';
import errorHandlerPlugin from './plugins/error-handler.ts';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

dotenv.config();
const isLocal = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

const server = fastify({
    logger: {
        enabled: true,
        transport: isLocal
            ? {
                target: 'pino-pretty',
            }
            : undefined,
    },
});

// swagger part
await server.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'Fintrack Auth API',
            description: 'Dokumentasi API untuk FinTrack Backend Authentication',
            version: '1.0.0',
        },
        servers: [
            { url: 'http://127.0.0.1:8081', description: 'Server Lokal' }
        ],
    },
});
await server.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
        docExpansion: 'list',
        deepLinking: false
    },
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

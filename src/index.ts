import fastify from 'fastify';
import dotenv from 'dotenv';

dotenv.config();

const server = fastify({
    logger: true
});

const PORT = Number(process.env.PORT) || 8081;
const PREFIX = process.env.API_PREFIX || 'auth/api';

// server.get('/api/v1/auth/health', async (request, reply) => {
//     return {
//         status: 'OK',
//         service: 'Authentication Service (Pure Fastify)',
//         timestamp: new Date()
//     };
// });
server.register(async (instance) => {
    instance.get('/health', async (request, reply) => {
        return {
            status: 'OK',
            service: 'Authentication Microservice (Pure Fastify v5)',
            timestamp: new Date()
        };
    });

}, { prefix: `/${PREFIX}` });

const start = async () => {
    try {
        await server.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`🔒 [auth-service]: Pure Fastify running on http://localhost:${PORT}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();

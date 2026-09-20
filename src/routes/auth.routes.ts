import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { getJwksHandler } from '../controllers/jwks.controller.ts';
import { registerHandler } from '../controllers/auth.controller.ts';
import { RegisterRouteDto } from '../dto/auth.dto.ts';

export async function authRoutes(server: FastifyInstance) {
    server.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
        return {
            status: 'OK',
            service: 'Authentication Microservice (Pure Fastify v5)',
            timestamp: new Date()
        };
    });
    server.get('/.well-known/jwks.json', getJwksHandler);
    server.post('/register', { schema: RegisterRouteDto }, registerHandler);
}

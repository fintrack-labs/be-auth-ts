import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { getJwksHandler } from '../controllers/jwks.controller.ts';
import { loginHandler, logoutHandler, refreshTokenHandler, registerHandler } from '../controllers/auth.controller.ts';
import { LoginRouteSchema, LogoutRouteSchema, RefreshTokenRouteSchema, RegisterRouteDto } from '../dto/auth.dto.ts';

export async function authRoutes(server: FastifyInstance) {
    server.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
        return {
            status: 'OK',
            service: 'Authentication Microservice (Pure Fastify v5)',
            timestamp: new Date()
        };
    });
    server.get('/.well-known/jwks.json', getJwksHandler);
    // server.post('/register', { schema: RegisterRouteDto }, registerHandler);
    server.post('/login', { schema: LoginRouteSchema }, loginHandler);
    server.post('/logout', { schema: LogoutRouteSchema }, logoutHandler);
    server.post('/refresh-token', { schema: RefreshTokenRouteSchema }, refreshTokenHandler);

    await server.register(userSubRoutes, { prefix: '/user' });
}

async function userSubRoutes(server: FastifyInstance) {
    server.post('/register', { schema: RegisterRouteDto }, registerHandler);
    // server.post('/add-group', { schema: AddGroupRouteSchema }, addGroupHandler);
    // server.post('/remove-group', { schema: RemoveGroupRouteSchema }, removeGroupHandler);
}

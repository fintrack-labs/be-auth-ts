import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { PrismaClient } from '@prisma/client';

declare module 'fastify' {
    interface FastifyInstance {
        prisma: PrismaClient;
    }
}

export default fp(async (fastify: FastifyInstance) => {
    const isLocal = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
    const prisma = new PrismaClient({
        log: isLocal
            ? [
                { emit: 'event', level: 'query' },
                { emit: 'stdout', level: 'error' },
                { emit: 'stdout', level: 'warn' },
            ]
            : [{ emit: 'stdout', level: 'error' }],
    });

    await prisma.$connect();

    if (isLocal) {
        (prisma as any).$on('query', (e: any) => {
            fastify.log.info({
                sql: e.query,
                params: e.params,
                duration: `${e.duration}ms`
            }, 'Prisma Query');
        });
    }

    fastify.decorate('prisma', prisma);

    fastify.addHook('onClose', async (instance: FastifyInstance) => {
        await instance.prisma.$disconnect();
    });
});
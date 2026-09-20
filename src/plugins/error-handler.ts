import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { AppError } from '../errors/app.error.ts';
import { Prisma } from '@prisma/client';

export default fp(async (fastify: FastifyInstance) => {
    fastify.setErrorHandler(
        (error: Error & { statusCode?: number; validation?: unknown }, request: FastifyRequest, reply: FastifyReply) => {
            if (error instanceof AppError) {
                return reply.status(error.statusCode).send({
                    statusCode: error.statusCode,
                    error: error.name,
                    message: error.message,
                    details: error.details,
                    timestamp: new Date().toISOString(),
                });
            }

            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                return reply.status(409).send({
                    statusCode: 409,
                    error: 'ConflictError',
                    message: 'Email atau data unik sudah terdaftar',
                    timestamp: new Date().toISOString(),
                });
            }

            if (error.validation) {
                return reply.status(400).send({
                    statusCode: 400,
                    error: 'Bad Request',
                    message: 'Input validation failed',
                    details: error.validation,
                    timestamp: new Date().toISOString(),
                });
            }

            request.log.error(error);

            return reply.status(500).send({
                statusCode: 500,
                error: 'Internal Server Error',
                message: 'Internal server error',
                timestamp: new Date().toISOString(),
            });
        }
    );
});
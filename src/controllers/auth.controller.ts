import type { FastifyReply, FastifyRequest } from 'fastify';
import type { RegisterBodyInput } from "../dto/auth.dto.ts";
import { registerUserService } from "../services/auth.service.ts";

export async function registerHandler(
    request: FastifyRequest<{ Body: RegisterBodyInput }>,
    reply: FastifyReply) {
    try {
        const result = await registerUserService(request.server, request.body);
        return reply.status(201).send({
            statusCode: 201,
            message: 'success',
            data: result,
        });
    } catch (error: any) {
        if (error.statusCode) {
            return reply.status(error.statusCode).send({
                statusCode: error.statusCode,
                error: error.name || 'Bad Request',
                message: error.message,
            });
        }
        throw error;
    }
}
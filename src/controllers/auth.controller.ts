import type { FastifyReply, FastifyRequest } from 'fastify';
import type { loginBodyInput, logoutBodyInput, refreshTokenBodyInput, RegisterBodyInput } from "../dto/auth.dto.ts";
import { loginUserService, logoutUserService, refreshTokenService, registerUserService } from "../services/auth.service.ts";
import { RESPONSE_SUCESS } from "../config/app.contants.ts";

export async function registerHandler(
    request: FastifyRequest<{ Body: RegisterBodyInput }>,
    reply: FastifyReply) {
    const result = await registerUserService(request.server, request.body);
    return reply.status(201).send({
        statusCode: 201,
        message: RESPONSE_SUCESS,
        data: result,
    });
}

export async function loginHandler(
    request: FastifyRequest<{ Body: loginBodyInput }>,
    reply: FastifyReply
) {
    const result = await loginUserService(request.server, request.body);
    return reply.status(200).send({
        statusCode: 200,
        message: RESPONSE_SUCESS,
        data: result
    });
}

export async function logoutHandler(
    request: FastifyRequest<{ Body: logoutBodyInput }>,
    reply: FastifyReply
) {
    const result = await logoutUserService(request.server, request.body);
    return reply.status(200).send({
        statusCode: 200,
        message: RESPONSE_SUCESS,
        data: result
    });
}

export async function refreshTokenHandler(
    request: FastifyRequest<{ Body: refreshTokenBodyInput }>,
    reply: FastifyReply
) {
    const result = await refreshTokenService(request.server, request.body);
    return reply.status(200).send({
        statusCode: 200,
        message: RESPONSE_SUCESS,
        data: result
    });
}

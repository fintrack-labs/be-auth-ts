import { type Static, Type } from '@sinclair/typebox';

export const RegisterBodyDto = Type.Object({
    email: Type.String({ format: 'email' }),
    password: Type.String({ minLength: 8, maxLength: 100 }),
    name: Type.String({ minLength: 2, maxLength: 100 }),
});
export type RegisterBodyInput = Static<typeof RegisterBodyDto>;
export const RegisterRouteDto = {
    tags: ['Auth'],
    summary: 'Register New User',
    body: RegisterBodyDto,
    response: {
        201: Type.Object({
            statusCode: Type.Number({ default: 201 }),
            message: Type.String(),
            data: Type.Object({
                user: Type.Object({
                    userId: Type.String(),
                    name: Type.String(),
                    email: Type.String(),
                    status: Type.String(),
                    createdAt: Type.Optional(Type.String()),
                }),
            }),
        }),
        409: Type.Object({
            statusCode: Type.Number({ default: 409 }),
            error: Type.String(),
            message: Type.String(),
        }),
    },
};

/**
 * login
 */
export const LoginBodyDto = Type.Object({
    email: Type.String({ format: 'email' }),
    password: Type.String({ minLength: 1 }),
    clientId: Type.String({ minLength: 1 }),
    clientSecret: Type.String({ minLength: 1 }),
});
export type loginBodyInput = Static<typeof LoginBodyDto>;
export const LoginRouteSchema = {
    body: LoginBodyDto,
    response: {
        200: Type.Object({
            statusCode: Type.Number({ example: 200 }),
            message: Type.String(),
            data: Type.Object({
                accessToken: Type.String(),
                refreshToken: Type.Optional(Type.String()),
                tokenType: Type.String({ example: 'Bearer' }),
                expiresIn: Type.Number({ example: 3600 }),
            }),
        }),
    },
};

/**
 * logout
 */
export const LogoutBodyDto = Type.Object({
    clientId: Type.String({ minLength: 1 }),
    clientSecret: Type.String({ minLength: 1 }),
    refreshToken: Type.String({ minLength: 1 }),
});
export type logoutBodyInput = Static<typeof LogoutBodyDto>;
export const LogoutRouteSchema = {
    body: LogoutBodyDto,
    response: {
        200: Type.Object({
            statusCode: Type.Number({ example: 200 }),
            message: Type.String(),
        }),
    },
};

export const RefreshTokenBodyDto = Type.Object({
    refreshToken: Type.String({ minLength: 1 }),
    clientId: Type.String({ minLength: 1 }),
    clientSecret: Type.String({ minLength: 1 }),
});
export type refreshTokenBodyInput = Static<typeof RefreshTokenBodyDto>;
export const RefreshTokenRouteSchema = {
    body: RefreshTokenBodyDto,
    response: {
        200: Type.Object({
            statusCode: Type.Number({ default: 200 }),
            message: Type.String(),
            data: Type.Object({
                accessToken: Type.String(),
                tokenType: Type.String({ example: 'Bearer' }),
                expiresIn: Type.Number({ example: 3600 }),
                refreshToken: Type.Optional(Type.String()),
            }),
        }),
    },
};
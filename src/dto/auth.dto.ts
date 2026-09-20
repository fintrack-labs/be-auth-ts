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
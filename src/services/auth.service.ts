import type { FastifyInstance } from "fastify";
import type { loginBodyInput, logoutBodyInput, refreshTokenBodyInput, RegisterBodyInput } from "../dto/auth.dto.ts";
import { hashPassword } from "../utils/crypto.ts";
import { ConflictError, UnauthorizedError } from "../errors/app.error.ts";
import { generateAccessToken, verifyPassword } from "../utils/auth.util.ts";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { RESPONSE_SUCESS } from "../config/app.contants.ts";

export type RolePrefix = '12' | '10' | '01';

export const ROLE_PREFIXES = {
    USER: '12',
    STAFF: '10',
    ADMIN: '01',
} as const;

export const USER_STATUS = {
    REGISTERED: 'REGISTERED',
    ACTIVE: 'ACTIVE',
    SUSPENDED: 'SUSPENDED',
    INACTIVE: 'INACTIVE',
    DELETED: 'DELETED',
} as const;

/**
 * Helper internal to generate userId 8 digit:
 * - 2 digit: ROLE_PREFIX
 * - 2 digit: last 2 digit of current year
 * - 4 digit: counter max ID + 1 on that year
 */
async function generateUserId(
    fastify: FastifyInstance,
    prefix: RolePrefix
): Promise<string> {
    const yearSuffix = new Date().getFullYear().toString().slice(-2);
    const prefixWithYear = `${prefix}${yearSuffix}`;
    const lastUser = await fastify.prisma.user.findFirst({
        where: {
            userId: {
                startsWith: prefixWithYear,
            },
        },
        select: {
            userId: true,
        },
        orderBy: {
            userId: 'desc',
        },
    });

    let nextSequence = 1;

    if (lastUser && lastUser.userId.length === 8) {
        const currentSequence = parseInt(lastUser.userId.substring(4), 10);
        if (!isNaN(currentSequence)) {
            nextSequence = currentSequence + 1;
        }
    }

    const paddedSequence = nextSequence.toString().padStart(4, '0');
    return `${prefixWithYear}${paddedSequence}`;
}

export async function registerUserService(fastify: FastifyInstance, payload: RegisterBodyInput) {
    const { email, password, name } = payload;

    const existingUser = await fastify.prisma.user.findUnique({
        where: { email },
        select: { userId: true },
    });

    if (existingUser) {
        throw new ConflictError('Email already registered');
    }

    const passwordHash = await hashPassword(password);
    const newUserId = await generateUserId(fastify, ROLE_PREFIXES.USER);

    const user = await fastify.prisma.user.create({
        data: {
            userId: newUserId,
            email,
            password: passwordHash,
            name,
            status: USER_STATUS.REGISTERED,
        },
        select: {
            userId: true,
            name: true,
            email: true,
            status: true,
            createdAt: true,
        },
    });

    return {
        user: {
            ...user,
            createdAt: user.createdAt ? user.createdAt.toISOString() : undefined,
        },
    };
}

export async function loginUserService(fastify: FastifyInstance, input: loginBodyInput) {
    const user = await fastify.prisma.user.findFirst({
        where: {
            email: input.email,
            status: USER_STATUS.ACTIVE,
            isDeleted: false,
        },
    });

    if (!user) {
        throw new UnauthorizedError('User not registered');
    }

    const isPasswordValid = await verifyPassword(input.password, user.password);
    if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid credentials');
    }

    const client = await checkClientId(fastify, input.clientId);

    const accessToken = await generateAccessToken({
        userId: user.userId,
        email: user.email,
        adGroup: [],
        clientId: client.clientId,
    });

    const rawRefreshToken = randomBytes(40).toString('hex');
    const refreshTokenHash = createHash('sha256').update(rawRefreshToken).digest('hex');

    await fastify.prisma.refreshToken.create({
        data: {
            tokenId: randomUUID(),
            userId: user.userId,
            clientId: client.clientId,
            tokenHash: refreshTokenHash,
            isRevoked: false,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
    });

    return {
        accessToken,
        tokenType: 'Bearer',
        expiresIn: 3600,
        refreshToken: rawRefreshToken,
    };
}

async function checkClientId(fastify: FastifyInstance, clientId: string) {
    const client = await fastify.prisma.client.findUnique({
        where: {
            clientId: clientId,
        },
    });

    if (!client) {
        throw new UnauthorizedError('Client ID not registered');
    }

    return client;
}

export async function logoutUserService(fastify: FastifyInstance, input: logoutBodyInput) {
    await checkClientId(fastify, input.clientId);
    const refreshTokenHash = createHash('sha256').update(input.refreshToken).digest('hex');
    const isExist = await fastify.prisma.refreshToken.findUnique({
        where: {
            tokenHash: refreshTokenHash,
            isRevoked: false,
            clientId: input.clientId
        }
    })

    if (!isExist) {
        throw new UnauthorizedError('Refresh token not found');
    }

    await fastify.prisma.refreshToken.update({
        where: {
            tokenHash: refreshTokenHash,
            isRevoked: false,
            clientId: input.clientId
        },
        data: {
            isRevoked: true,
        },
    });

    return {
        message: RESPONSE_SUCESS,
    };
}

export async function refreshTokenService(fastify: FastifyInstance, input: refreshTokenBodyInput) {
    await checkClientId(fastify, input.clientId);
    const refreshTokenHash = createHash('sha256').update(input.refreshToken).digest('hex');
    const refreshToken = await fastify.prisma.refreshToken.findFirst({
        where: {
            tokenHash: refreshTokenHash,
            isRevoked: false,
            clientId: input.clientId
        },
        select: {
            userId: true
        }
    });

    if (!refreshToken) {
        throw new UnauthorizedError('Refresh token not found');
    }

    const userData = await fastify.prisma.user.findUnique({
        where: {
            userId: refreshToken.userId,
        },
        select: {
            email: true
        }
    });

    if (!userData) {
        throw new UnauthorizedError('User not found');
    }

    const accessToken = await generateAccessToken({
        userId: refreshToken.userId,
        email: userData.email,
        adGroup: [],
        clientId: input.clientId,
    });

    const rawRefreshToken = randomBytes(40).toString('hex');
    const newRefreshTokenHash = createHash('sha256').update(rawRefreshToken).digest('hex');
    await fastify.prisma.refreshToken.update({
        where: {
            tokenHash: refreshTokenHash,
            isRevoked: false,
            clientId: input.clientId
        },
        data: {
            tokenHash: newRefreshTokenHash,
        },
    });

    return {
        accessToken,
        tokenType: 'Bearer',
        expiresIn: 3600,
        refreshToken: rawRefreshToken,
    };
}
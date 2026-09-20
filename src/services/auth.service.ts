import type { FastifyInstance } from "fastify";
import type { RegisterBodyInput } from "../dto/auth.dto.ts";
import { hashPassword } from "../utils/crypto.ts";
import { ConflictError } from "../errors/app.error.ts";

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
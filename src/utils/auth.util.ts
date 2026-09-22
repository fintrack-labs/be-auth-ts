import { compareSync } from 'bcryptjs';
import { readFile } from 'fs/promises';
import * as jose from 'jose';
import path from 'path';

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
    return await compareSync(password, storedHash);
}

export interface JwtPayloadInput {
    userId: string;
    email: string;
    adGroup?: string[];
    clientId: string;
}
export async function generateAccessToken(payload: JwtPayloadInput) {
    const envCertPath = process.env.JWT_PRIVATE_KEY;

    if (!envCertPath) {
        throw new Error("JWT_PRIVATE_KEY is not defined");
    }
    const certPath = path.resolve(process.cwd(), envCertPath);
    let privateKeyPem: string;
    try {
        privateKeyPem = await readFile(certPath, 'utf8');
    } catch (error) {
        throw new Error(`Failed to read private key from path: ${certPath}`);
    }

    const privateKey = await jose.importPKCS8(privateKeyPem, 'RS256');
    return await new jose.SignJWT({
        email: payload.email,
        adGroup: payload.adGroup || [],
        clientId: payload.clientId,
    })
        .setProtectedHeader({
            alg: 'RS256',
            typ: 'JWT',
            kid: process.env.TOKEN_KID
        })
        .setSubject(payload.userId)
        .setIssuedAt()
        .setIssuer('fintrack-be-auth')
        .setExpirationTime('1h')
        .sign(privateKey);
}
import bcrypt from 'bcryptjs';
// import fs from 'fs';
// import path from 'path';
// import { SignJWT, importPKCS8 } from 'jose';

// Load Private Key untuk RS256 JWT
// const PRIVATE_KEY_PATH = process.env.JWT_PRIVATE_KEY_PATH || path.join(process.cwd(), 'keys/private.pem');
// const PRIVATE_KEY_PEM = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');
// const KEY_ID = process.env.JWT_KEY_ID || 'auth-key-001';

export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

// export async function generateTokens(payload: { userId: string; email: string }) {
//     const privateKey = await importPKCS8(PRIVATE_KEY_PEM, 'RS256');

//     const accessToken = await new SignJWT({
//         email: payload.email,
//         type: 'access',
//     })
//         .setProtectedHeader({ alg: 'RS256', kid: KEY_ID })
//         .setSubject(payload.userId)
//         .setIssuedAt()
//         .setExpirationTime('15m')
//         .sign(privateKey);

//     const refreshToken = await new SignJWT({
//         type: 'refresh',
//     })
//         .setProtectedHeader({ alg: 'RS256', kid: KEY_ID })
//         .setSubject(payload.userId)
//         .setIssuedAt()
//         .setExpirationTime('7d')
//         .sign(privateKey);

//     return { accessToken, refreshToken };
// }
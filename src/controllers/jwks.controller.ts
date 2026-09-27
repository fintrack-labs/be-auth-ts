import type { FastifyRequest, FastifyReply } from 'fastify';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exportJWK, importSPKI } from 'jose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getJwksHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
        const publicKeyPath = path.join(__dirname, '../certs/public.pem');
        const publicKeyPem = fs.readFileSync(publicKeyPath, 'utf8');
        const ecPublicKey = await importSPKI(publicKeyPem, 'RS256');
        const jwk = await exportJWK(ecPublicKey);
        const jwks = {
            keys: [
                {
                    ...jwk,
                    kty: 'RSA',
                    use: 'sig',
                    alg: 'RS256',
                    kid: process.env.TOKEN_KID
                }
            ]
        };

        return reply.status(200).send(jwks);
    } catch (error) {
        request.log.error(error);
        return reply.status(500).send({
            error: 'Internal Server Error',
            message: 'Failed to convert and export public key into JWK schema'
        });
    }
}

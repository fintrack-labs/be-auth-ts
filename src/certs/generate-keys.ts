import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const certsDir = __dirname;

export function generateKeyPairSync() {
    const privateKeyPath = path.join(certsDir, 'private.pem');
    const publicKeyPath = path.join(certsDir, 'public.pem');

    if (fs.existsSync(privateKeyPath) && fs.existsSync(publicKeyPath)) {
        console.log('[Keypair]: Keys already exist. Skipping generation.');
        return;
    }

    console.log('[Keypair]: Generating new RS256 Keypair...');

    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    });

    fs.writeFileSync(privateKeyPath, privateKey);
    fs.writeFileSync(publicKeyPath, publicKey);

    console.log('[Keypair]: private.pem and public.pem generated successfully!');
}

generateKeyPairSync();

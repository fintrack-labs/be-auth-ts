import { AuditSoftDeleteEntity } from "./base.model.ts";
import { ClientModel } from "./client.model.ts";
import { UserModel } from "./user.model.ts";

export interface RefreshTokenModel extends AuditSoftDeleteEntity {
    tokenId: string;
    userId: string;
    clientId: string;
    tokenHash: string;
    isRevoked: boolean;
    expiresAt: Date;

    user?: UserModel;
    client?: ClientModel;
}
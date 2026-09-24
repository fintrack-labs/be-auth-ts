import { AuditSoftDeleteEntity } from "./base.model.ts";
import { RefreshTokenModel } from "./refresh-token.model.ts";

export interface ClientModel extends AuditSoftDeleteEntity {
    clientId: string;
    clientSecret: string;
    clientName: string;
    description?: string | null;

    refreshTokens?: RefreshTokenModel[];
}
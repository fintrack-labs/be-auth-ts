import { AuditSoftDeleteEntity } from './base.model.ts';
import { GroupModel } from './group.model.ts';
import { RefreshTokenModel } from './refresh-token.model.ts';

export interface UserModel extends AuditSoftDeleteEntity {
    userId: string;
    name: string;
    email: string;
    password: string;
    adGroups?: string[];
    status: string;
    activationTokenHash?: string | null;
    activationTokenExpiresAt?: Date | null;
    lastLoginAttemptAt?: Date | null;
    groups?: GroupModel[];
    refreshTokens?: RefreshTokenModel[];
}
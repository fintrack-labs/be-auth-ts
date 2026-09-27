import { AuditSoftDeleteEntity } from './base.model.ts';

export interface TenantModel extends AuditSoftDeleteEntity {
    id: string;
    name: string;
    isActive: boolean;
}

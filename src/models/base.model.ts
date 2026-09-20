export interface AuditEntity {
    createdBy?: string | null;
    createdAt: Date;
    updatedBy?: string | null;
    updatedAt?: Date | null;
}

export interface SoftDeleteEntity {
    isDeleted: boolean;
    deletedBy?: string | null;
    deletedAt?: Date | null;
}

export interface AuditSoftDeleteEntity extends AuditEntity, SoftDeleteEntity { }
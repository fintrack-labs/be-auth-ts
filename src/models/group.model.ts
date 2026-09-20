import { AuditSoftDeleteEntity } from './base.model.ts';
import { UserModel } from './user.model.ts';

export interface GroupModel extends AuditSoftDeleteEntity {
    groupId: string;
    groupName: string;
    description?: string;
    users?: UserModel[];
}

import { AuditSoftDeleteEntity } from './base.model.ts';
import { GroupModel } from './group.model.ts';

export interface UserModel extends AuditSoftDeleteEntity {
    userId: string
    name: string
    email: string
    password: string
    adGroups: string[]
    status: string
    groups?: GroupModel[]
}
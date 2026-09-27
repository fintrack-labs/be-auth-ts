import { IBaseRepository } from './base.repository.ts';
import { UserModel } from '../models/user.model.ts';

export interface IUserRepository extends IBaseRepository<UserModel, string> {
    findByEmail(email: string): Promise<UserModel | null>;
    assignGroup(userId: string, groupId: string): Promise<void>;
}

import { PrismaClient } from '@prisma/client';
import { IUserRepository } from './user.repository.ts';
import { UserModel } from '../models/user.model.ts';

export class PrismaUserRepository implements IUserRepository {
    constructor(private prisma: PrismaClient) { }

    async findById(id: string): Promise<UserModel | null> {
        const user = await this.prisma.user.findUnique({
            where: { userId: id },
            include: { userGroups: { include: { group: true } } }
        });

        if (!user) return null;

        return {
            ...user,
            adGroups: [],
            groups: user.userGroups.map((ug: { group: any }) => ({
                ...ug.group,
                description: ug.group.description ?? undefined
            }))
        };
    }

    async findByEmail(email: string): Promise<UserModel | null> {
        return await this.prisma.user.findUnique({ where: { email } }) as UserModel | null;
    }

    async findAll(): Promise<UserModel[]> {
        return await this.prisma.user.findMany() as UserModel[];
    }

    // Fungsi save() bertindak seperti em.merge() atau em.persist() di Hibernate
    async save(entity: Partial<UserModel> & { userId: string }): Promise<UserModel> {
        return await this.prisma.user.upsert({
            where: { userId: entity.userId },
            update: {
                name: entity.name,
                email: entity.email,
                password: entity.password,
                status: entity.status,
            },
            create: {
                userId: entity.userId,
                name: entity.name!,
                email: entity.email!,
                password: entity.password!,
                status: entity.status,
            }
        }) as UserModel;
    }

    async deleteById(id: string): Promise<boolean> {
        // Implementasi Soft Delete sesuai kontrak AuditSoftDeleteEntity Anda
        const deleted = await this.prisma.user.update({
            where: { userId: id },
            data: { isDeleted: true, deletedAt: new Date() }
        });
        return !!deleted;
    }

    // Mengelola tabel perantara Many-to-Many (user_groups)
    async assignGroup(userId: string, groupId: string): Promise<void> {
        await this.prisma.userGroup.create({
            data: {
                userId: userId,
                groupId: groupId,
                assignedBy: 'SYSTEM' // Contoh default operator
            }
        });
    }
}

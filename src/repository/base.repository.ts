export interface IBaseRepository<T, ID> {
    findById(id: ID): Promise<T | null>;
    findAll(): Promise<T[]>;
    save(entity: Partial<T>): Promise<T>;
    deleteById(id: ID): Promise<boolean>;
}

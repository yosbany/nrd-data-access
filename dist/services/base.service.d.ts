import { BaseEntity } from '../models';
export declare class BaseService<T extends BaseEntity> {
    protected path: string;
    constructor(path: string);
    /**
     * Get all entities
     */
    getAll(): Promise<T[]>;
    /**
     * Get entity by ID
     */
    getById(id: string): Promise<T | null>;
    /**
     * Create a new entity
     */
    create(entity: Omit<T, 'id'>): Promise<string>;
    /**
     * Update an existing entity
     */
    update(id: string, updates: Partial<Omit<T, 'id'>>): Promise<void>;
    /**
     * Delete an entity
     */
    delete(id: string): Promise<void>;
    /**
     * Query entities by child value
     */
    queryByChild(childPath: string, value: any): Promise<T[]>;
    /**
     * Listen to real-time changes
     */
    onValue(callback: (data: T[]) => void): () => void;
    /**
     * Listen to real-time changes for a specific entity
     */
    onValueById(id: string, callback: (data: T | null) => void): () => void;
}
//# sourceMappingURL=base.service.d.ts.map
export declare class ConfigService {
    private readonly path;
    /**
     * Get a configuration value by key
     */
    get(key: string): Promise<string | null>;
    /**
     * Set a configuration value (creates or replaces)
     */
    set(key: string, value: string): Promise<void>;
    /**
     * Get all configuration values
     */
    getAll(): Promise<Record<string, string>>;
    /**
     * Update multiple configuration values (partial update)
     */
    update(updates: Record<string, string>): Promise<void>;
    /**
     * Delete a configuration key
     */
    delete(key: string): Promise<void>;
}
//# sourceMappingURL=config.service.d.ts.map
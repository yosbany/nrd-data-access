export interface ConfigItem {
    name: string;
    variableName: string;
    description: string;
    value: string;
}
export declare class ConfigService {
    private readonly path;
    /**
     * Get a configuration value by key (backward compatible for nrd-costos, etc.)
     */
    get(key: string): Promise<string | null>;
    /**
     * Set a configuration value (legacy, creates minimal object)
     */
    set(key: string, value: string): Promise<void>;
    /**
     * Get a full config item by variable name
     */
    getConfig(variableName: string): Promise<ConfigItem | null>;
    /**
     * Get all configs with full details (name, variableName, description, value)
     */
    getAllWithDetails(): Promise<Record<string, ConfigItem>>;
    /**
     * Legacy: get all as key->value (for backward compatibility)
     */
    getAll(): Promise<Record<string, string>>;
    /**
     * Save a full config item
     */
    setConfig(variableName: string, item: ConfigItem): Promise<void>;
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
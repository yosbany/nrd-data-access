import { CompanyInfo } from '../models';
export declare class CompanyInfoService {
    private readonly path;
    /**
     * Get company info
     */
    get(): Promise<CompanyInfo | null>;
    /**
     * Set company info (creates or replaces)
     */
    set(companyInfo: CompanyInfo): Promise<void>;
    /**
     * Update company info (partial update)
     */
    update(updates: Partial<CompanyInfo>): Promise<void>;
}
//# sourceMappingURL=company-info.service.d.ts.map
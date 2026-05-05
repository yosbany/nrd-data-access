import { BaseService } from './base.service';
import { FCMToken } from '../models';
export declare class FCMTokensService extends BaseService<FCMToken> {
    constructor();
    /**
     * Get all active tokens (active !== false)
     */
    getActive(): Promise<FCMToken[]>;
}
//# sourceMappingURL=fcm-tokens.service.d.ts.map
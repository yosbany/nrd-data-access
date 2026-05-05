import { BaseService } from './base.service';
import { Notification } from '../models';
export declare class NotificationsService extends BaseService<Notification> {
    constructor();
    /**
     * Get all pending notifications (not sent)
     */
    getPending(): Promise<Notification[]>;
    /**
     * Mark notification as sent
     */
    markAsSent(id: string): Promise<void>;
    /**
     * Mark notification as failed
     */
    markAsFailed(id: string, error: string): Promise<void>;
}
//# sourceMappingURL=notifications.service.d.ts.map
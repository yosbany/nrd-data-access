import { BaseService } from './base.service';
import { Notification } from '../models';

export class NotificationsService extends BaseService<Notification> {
  constructor() {
    super('notifications');
  }

  /**
   * Get all pending notifications (not sent)
   */
  async getPending(): Promise<Notification[]> {
    const allNotifications = await this.getAll();
    return allNotifications.filter(n => !n.sent);
  }

  /**
   * Mark notification as sent
   */
  async markAsSent(id: string): Promise<void> {
    await this.update(id, {
      sent: true,
      sentAt: Date.now()
    });
  }

  /**
   * Mark notification as failed
   */
  async markAsFailed(id: string, error: string): Promise<void> {
    await this.update(id, {
      error: error
    });
  }
}

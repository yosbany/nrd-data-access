import { BaseService } from './base.service';
import { FCMToken } from '../models';

export class FCMTokensService extends BaseService<FCMToken> {
  constructor() {
    super('fcmTokens');
  }

  /**
   * Get all active tokens (active !== false)
   */
  async getActive(): Promise<FCMToken[]> {
    const allTokens = await this.getAll();
    return allTokens.filter(t => t.active !== false);
  }
}

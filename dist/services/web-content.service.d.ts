import { Unsubscribe } from 'firebase/database';
import { WebContent } from '../models';
/**
 * Servicio para el nodo único /web (contenido editable de nrd-web).
 */
export declare class WebContentService {
    private readonly path;
    get(): Promise<WebContent | null>;
    set(content: WebContent): Promise<void>;
    update(updates: Partial<WebContent>): Promise<void>;
    onValue(callback: (content: WebContent | null) => void): Unsubscribe;
    getRef(): import("@firebase/database").DatabaseReference;
}
//# sourceMappingURL=web-content.service.d.ts.map
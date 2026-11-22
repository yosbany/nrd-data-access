import { User, UserCredential } from 'firebase/auth';
export declare class AuthService {
    /**
     * Sign in anonymously. Use for public/catalog apps that need Firebase access without user registration.
     * Enable "Anonymous" in Firebase Console → Authentication → Sign-in method.
     */
    signInAnonymously(): Promise<UserCredential>;
    /**
     * Sign in with email and password
     */
    signIn(email: string, password: string): Promise<UserCredential>;
    /**
     * Sign in with a Firebase custom token (SSO between NRD apps; minted by nrd-backend-api /api/sso/token).
     */
    signInWithCustomToken(token: string): Promise<UserCredential>;
    /**
     * Firebase ID token of the current user (null if signed out).
     */
    getIdToken(forceRefresh?: boolean): Promise<string | null>;
    /**
     * Create a new user account
     */
    signUp(email: string, password: string): Promise<UserCredential>;
    /**
     * Sign out the current user
     */
    signOut(): Promise<void>;
    /**
     * Get the current user
     */
    getCurrentUser(): User | null;
    /**
     * Listen to authentication state changes
     */
    onAuthStateChanged(callback: (user: User | null) => void): () => void;
}
//# sourceMappingURL=auth.service.d.ts.map
import { User, UserCredential } from 'firebase/auth';
export declare class AuthService {
    /**
     * Sign in with email and password
     */
    signIn(email: string, password: string): Promise<UserCredential>;
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
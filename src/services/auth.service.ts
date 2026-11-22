import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInAnonymously,
  signInWithCustomToken,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential
} from 'firebase/auth';
import { getFirebaseAuth } from '../config/firebase';

export class AuthService {
  /**
   * Sign in anonymously. Use for public/catalog apps that need Firebase access without user registration.
   * Enable "Anonymous" in Firebase Console → Authentication → Sign-in method.
   */
  async signInAnonymously(): Promise<UserCredential> {
    const auth = getFirebaseAuth();
    return signInAnonymously(auth);
  }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<UserCredential> {
    const auth = getFirebaseAuth();
    return signInWithEmailAndPassword(auth, email, password);
  }

  /**
   * Sign in with a Firebase custom token (SSO between NRD apps; minted by nrd-backend-api /api/sso/token).
   */
  async signInWithCustomToken(token: string): Promise<UserCredential> {
    const auth = getFirebaseAuth();
    return signInWithCustomToken(auth, token);
  }

  /**
   * Firebase ID token of the current user (null if signed out).
   */
  async getIdToken(forceRefresh = false): Promise<string | null> {
    const user = getFirebaseAuth().currentUser;
    return user ? user.getIdToken(forceRefresh) : null;
  }

  /**
   * Create a new user account
   */
  async signUp(email: string, password: string): Promise<UserCredential> {
    const auth = getFirebaseAuth();
    return createUserWithEmailAndPassword(auth, email, password);
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<void> {
    const auth = getFirebaseAuth();
    return signOut(auth);
  }

  /**
   * Get the current user
   */
  getCurrentUser(): User | null {
    const auth = getFirebaseAuth();
    return auth.currentUser;
  }

  /**
   * Listen to authentication state changes
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    const auth = getFirebaseAuth();
    return onAuthStateChanged(auth, callback);
  }
}


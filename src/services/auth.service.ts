import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential
} from 'firebase/auth';
import { getFirebaseAuth } from '../config/firebase';

export class AuthService {
  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<UserCredential> {
    const auth = getFirebaseAuth();
    return signInWithEmailAndPassword(auth, email, password);
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


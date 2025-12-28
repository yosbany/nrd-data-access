import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getDatabase, Database } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyD02egBPI7FnsliANDKa8noTkVmGMW0POg",
  authDomain: "nrd-db.firebaseapp.com",
  databaseURL: "https://nrd-db-default-rtdb.firebaseio.com",
  projectId: "nrd-db",
  storageBucket: "nrd-db.firebasestorage.app",
  messagingSenderId: "544444461682",
  appId: "1:544444461682:web:110c97ffffc984ddd208eb"
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let database: Database | null = null;

export function initializeFirebase(): void {
  if (!app) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    database = getDatabase(app);
  }
}

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    initializeFirebase();
  }
  return app!;
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    initializeFirebase();
  }
  return auth!;
}

export function getFirebaseDatabase(): Database {
  if (!database) {
    initializeFirebase();
  }
  return database!;
}


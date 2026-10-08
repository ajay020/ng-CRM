import { Injectable, signal } from '@angular/core';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { auth } from '../firebase';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = signal<User | null>(null);
  authInitialized = signal(false);

  constructor() {
    onAuthStateChanged(auth, (user) => {
      this.currentUser.set(user);
      this.authInitialized.set(true);
    });
  }

  async login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async logout() {
    await signOut(auth);
  }

  waitForAuth(): Promise<User | null> {
    return new Promise((resolve) => {
      if (this.authInitialized()) {
        resolve(this.currentUser());
        return;
      }

      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }
}

import { Injectable, signal } from '@angular/core';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { auth } from '../firebase';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = signal<User | null>(null);

  constructor() {
    onAuthStateChanged(auth, (user) => {
      this.currentUser.set(user);
    });
  }

  async login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async logout() {
    await signOut(auth);
  }
}

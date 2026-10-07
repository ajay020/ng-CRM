import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(true);
      } else {
        router.navigate(['/login']);
        resolve(false);
      }
    });
  });
};
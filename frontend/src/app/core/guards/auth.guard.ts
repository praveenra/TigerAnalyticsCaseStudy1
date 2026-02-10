import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import api from '../services/axios-instance'; // your Axios instance
import { from, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): Observable<boolean> {
    // Use Axios to call /auth/me with credentials
    return from(api.get('/auth/me', { withCredentials: true })).pipe(
      map(() => true), // Token valid → allow access
      catchError(() => {
        this.router.navigate(['/login']); // Token missing/invalid → redirect
        return of(false);
      })
    );
  }
}

@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): Observable<boolean> {
    return from(api.get('/auth/me', { withCredentials: true })).pipe(
      map(() => {
        this.router.navigate(['/dashboard']); // Already logged in → redirect
        return false;
      }),
      catchError(() => of(true)) // Not logged in → allow access
    );
  }
}

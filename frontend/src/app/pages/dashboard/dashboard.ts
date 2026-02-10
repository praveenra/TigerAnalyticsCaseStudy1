import { Component, signal } from '@angular/core';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
import { PricingTab } from '../pricing/pricing';
import { StoresTab } from '../stores/stores';
import { UsersTab } from '../users/users';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import api from '../../core/services/axios-instance';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatTabsModule, PricingTab, StoresTab, UsersTab, MatToolbarModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  constructor(private snack: MatSnackBar,private router: Router) {}
  activeTabIndex = signal(0);
  userName = signal(localStorage.getItem('user') || 'User');

  async logout() {
    try {
      // Call backend logout API
      await api.post('/auth/logout',
        {}, { withCredentials: true }
      );

      // Clear local storage
      localStorage.clear();

      // Clear cookies
      document.cookie.split(';').forEach((c) => {
        document.cookie = c
          .replace(/^ +/, '')
          .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
      });

      this.snack.open('Logged out successfully', 'Close', { duration: 3000 });

      // Redirect to login
      this.router.navigate(['/login']);
    } catch (err) {
      console.error('Logout failed', err);
      this.snack.open('Logout failed', 'Close', { duration: 3000 });
    }
  }
}

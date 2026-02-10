import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule]
})
export class Login {
  form: FormGroup;
  errorMessage = '';
  loading = false;

  constructor(private fb: FormBuilder, private router: Router, private snackBar: MatSnackBar ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async submit() {
    if (this.form.invalid) {
      this.errorMessage = 'Please fill all fields correctly';
      this.snackBar.open('Please fill all fields correctly', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      await AuthService.login(this.form.value);
      this.snackBar.open('Login successful', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-success']
      });
      this.router.navigate(['/dashboard']); // redirect after login
    } catch (err: any) {
      this.errorMessage = err.response?.data?.message || 'Login failed';
      this.snackBar.open(this.errorMessage, 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
    } finally {
      this.loading = false;
    }
  }
}

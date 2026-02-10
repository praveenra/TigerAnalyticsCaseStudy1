import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import axios from 'axios';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrl: './register.css',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule]
})
export class Register {
  form: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private router: Router, private snackBar: MatSnackBar) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup) {
    return group.get('password')!.value === group.get('confirmPassword')!.value
      ? null : { mismatch: true };
  }

  async submit() {
    if (this.form.invalid) {
      this.snackBar.open('Please fill all fields correctly', 'Close', { duration: 3000 });
      return;
    }

    this.loading = true;

    try {
      const response = await axios.post('http://localhost:3000/auth/register', this.form.value);
      this.snackBar.open(response.data.message || 'Registration successful', 'Close', { duration: 3000 });
      this.router.navigate(['/login']);
    } catch (err: any) {
      this.snackBar.open(err.response?.data?.message || 'Registration failed', 'Close', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }
  goToLogin() {
    this.router.navigate(['/login']); // navigate to login page
  }
}

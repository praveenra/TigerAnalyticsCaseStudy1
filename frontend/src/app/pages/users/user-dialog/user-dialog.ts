
// store-dialog.ts
import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import api from '../../../core/services/axios-instance';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatSelectModule
  ],
  templateUrl: './user-dialog.html',
  styleUrl: './user-dialog.css',
})
export class UserDialog {
  form: FormGroup;
  loading = signal(false);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserDialog>,
    private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any // for edit, data will have existing user
  ) {
    this.form = this.fb.group({
      _id: [data?.id || ''],
      name: [data?.name || '', Validators.required],
      email: [data?.email || '', Validators.required],
      role: [data?.role || ''],
      isActive: [data?.isActive || true]
    });

    if (this.data) {
    this.form.patchValue({
      _id: this.data._id,
      name: this.data.name,
      email: this.data.email,
      role: this.data.role,
      isActive: this.data.isActive,
    });
  }
  }

  async submit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    try {
      const { _id, ...payload } = this.form.value;
      if (this.data?._id) {
        // Edit user
        await api.put(`/user/${this.data._id}`, payload);
        this.snack.open('User updated successfully', 'Close', { duration: 3000 });
      } else {
        // Add new user
        await api.post('/user', payload);
        this.snack.open('User added successfully', 'Close', { duration: 3000 });
      }
      this.dialogRef.close(true); // close and signal parent to reload table
    } catch (err: any) {
      console.error(err);
      this.snack.open(err.response?.data?.message || 'Operation failed', 'Close', { duration: 3000 });
    } finally {
      this.loading.set(false);
    }
  }

  close() {
    this.dialogRef.close();
  }
}

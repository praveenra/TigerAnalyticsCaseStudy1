
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
  selector: 'app-store-dialog',
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
  templateUrl: './store-dialog.html',
  styleUrl: './store-dialog.css',
})
export class StoreDialog {
  form: FormGroup;
  loading = signal(false);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<StoreDialog>,
    private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any // for edit, data will have existing store
  ) {
    this.form = this.fb.group({
      storeId: [data?.storeId || ''],
      name: [data?.name || '', Validators.required],
      city: [data?.city || 'Chennai'],
      country: [data?.country || ''],
      currency: [data?.currency || 'INR'],
      state: [data?.state || ''],
      isActive: [data?.isActive || false]
    });

    if (this.data) {
    this.form.patchValue({
      storeId: this.data.storeId,
      name: this.data.name,
      city: this.data.city,
      country: this.data.country,
      currency: this.data.currency,
      state: this.data.state,
      isActive: this.data.isActive,
    });
  }
  }

  async submit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    try {
      const { storeId, ...payload } = this.form.value;
      if (this.data?.storeId) {
        // Edit store
        await api.put(`/store/${this.data.storeId}`, payload);
        this.snack.open('Store updated successfully', 'Close', { duration: 3000 });
      } else {
        // Add new store
        await api.post('/store', payload);
        this.snack.open('Store added successfully', 'Close', { duration: 3000 });
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

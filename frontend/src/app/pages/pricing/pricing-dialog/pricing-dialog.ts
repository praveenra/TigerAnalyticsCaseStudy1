// pricing-dialog.ts
import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import api from '../../../core/services/axios-instance';

@Component({
  selector: 'app-pricing-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './pricing-dialog.html'
})
export class PricingDialog {
  form: FormGroup;
  loading = signal(false);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PricingDialog>,
    private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any // for edit, data will have existing pricing
  ) {
    this.form = this.fb.group({
      storeId: [data?.storeId || '', Validators.required],
      sku: [data?.sku || '', Validators.required],
      productName: [data?.productName || '', Validators.required],
      price: [data?.price || '', [Validators.required, Validators.min(0.01)]],
      effectiveDate: [data?.effectiveDate || '', Validators.required]
    });

    if (this.data) {
    this.form.patchValue({
      storeId: this.data.storeId,
      sku: this.data.sku,
      productName: this.data.productName,
      price: this.data.price,
      effectiveDate: this.formatDate(this.data.effectiveDate),
    });
  }
  }

  async submit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    try {
      if (this.data?.id) {
        // Edit pricing
        await api.put(`/pricing/${this.data.id}`, this.form.value);
        this.snack.open('Pricing updated successfully', 'Close', { duration: 3000 });
      } else {
        // Add new pricing
        await api.post('/pricing', this.form.value);
        this.snack.open('Pricing added successfully', 'Close', { duration: 3000 });
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

  // Helper function
  formatDate(date: string | Date): string {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }
}

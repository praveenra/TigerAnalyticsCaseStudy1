import { Component, OnInit, ViewChild, signal, OnChanges, SimpleChanges, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { PricingDialog } from './pricing-dialog/pricing-dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import api from '../../core/services/axios-instance';

interface Pricing {
  _id: string;
  storeId: string;
  sku: string;
  productName: string;
  price: number;
  effectiveDate: string;
}

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
  ],
  templateUrl: './pricing.html',
  styleUrls: ['./pricing.css']
})
export class PricingTab implements OnInit, OnChanges  {

  constructor(private dialog: MatDialog,private snack: MatSnackBar,) {}

  @Input() active: boolean = false;

  pricings = signal<Pricing[]>([]);
  loading = signal(false);
  searchTerm = signal('');

  displayedColumns: string[] = ['storeId', 'sku', 'productName', 'price', 'effectiveDate', 'isActive', 'actions'];

  pageIndex = signal(0);
  pageSize = signal(5);
  totalRecords = signal(0);
  sortBy = signal('createdAt');
  sortOrder = signal<'asc' | 'desc'>('desc');

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.loadPricing();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['active'] && this.active) {
      // Tab became active
      this.loadPricing();
      this.loading.set(true); // remove this line if you want reload every time tab is selected
    }
  }
  
  async loadPricing() {
    this.loading.set(true);
    try {
      const res = await api.get('/pricing', {
        params: {
          search: this.searchTerm(),
          limit: this.pageSize(),
          offset: this.pageIndex() * this.pageSize(),
          sortBy: this.sortBy(),
          sortOrder: this.sortOrder()
        }
      });
      this.pricings.set(res.data.data);
      this.totalRecords.set(res.data.total);
    } catch (err) {
      console.error('Failed to load pricing', err);
    } finally {
      this.loading.set(false);
    }
  }

  onPageChange(event: any) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadPricing();
  }

  onSortChange(event: any) {
    this.sortBy.set(event.active);
    this.sortOrder.set(event.direction || 'asc');
    this.loadPricing();
  }

  viewPricing(p: Pricing) {
    alert(`Viewing: ${p.productName} - ${p.price}`);
  }

  // editPricing(p: Pricing) {
  //   const newPrice = prompt('Enter new price', p.price.toString());
  //   if (!newPrice) return;
  //   api.put(`/pricing/${p._id}`, { price: parseFloat(newPrice) })
  //     .then(() => this.loadPricing())
  //     .catch(err => console.error('Update failed', err));
  // }

  // Add new pricing
  addPricing() {
    const dialogRef = this.dialog.open(PricingDialog, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) this.loadPricing();
    });
  }

  // Edit existing pricing
  editPricing(row: Pricing) {
    const dialogRef = this.dialog.open(PricingDialog, {
      width: '400px',
      data: { ...row, id: row._id }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) this.loadPricing();
    });
  }

  bulkUpload() {
    // Open file dialog
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv';
    fileInput.onchange = async (event: any) => {
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file); // must match multer key

      this.loading.set(true);

      try {
        const response = await api.post('/pricing/upload',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true  }
        );
        this.snack.open(response.data.message, 'Close', { duration: 3000 });
        this.loadPricing();

      } catch (error) {
        this.snack.open('Upload failed', 'Close', { duration: 3000 });
      } finally {
        this.loading.set(false);
      }
    };

    fileInput.click(); // trigger file select dialog
  }

  async exportPricing() {
  this.loading.set(true);
  try {
    const res = await api.get('/pricing/export', {
      params: {
        search: this.searchTerm(),
        limit: this.pageSize(),
        offset: this.pageIndex() * this.pageSize(),
        sortBy: this.sortBy(),
        sortOrder: this.sortOrder()
      },
      responseType: 'blob' // IMPORTANT: ensures CSV is received as a file
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'print_data.csv'); // File name
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error('Failed to load pricing', err);
  } finally {
    this.loading.set(false);
  }
}

}

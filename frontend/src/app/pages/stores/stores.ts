import { Component, OnInit, ViewChild, signal, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { StoreDialog } from './store-dialog/store-dialog';
import api from '../../core/services/axios-instance';

interface Store {
  _id: string;
  storeId: string;
  name: string;
  city: string;
  currency: number;
  effectiveDate: string;
}

@Component({
  selector: 'app-stores',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './stores.html',
  styleUrls: ['./stores.css']
})
export class StoresTab implements OnInit, OnChanges {

  constructor(private dialog: MatDialog) {}

  @Input() active: boolean = false;

  stores = signal<Store[]>([]);
  loading = signal(false);
  searchTerm = signal('');

  displayedColumns: string[] = ['storeId', 'name', 'city', 'currency', 'isActive', 'actions'];

  pageIndex = signal(0);
  pageSize = signal(5);
  totalRecords = signal(0);
  sortBy = signal('createdAt');
  sortOrder = signal<'asc' | 'desc'>('desc');

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.loadStores();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['active'] && this.active) {
      // Tab became active
      this.loadStores();
      this.loading.set(true); // remove this line if you want reload every time tab is selected
    }
  }

  async loadStores() {
    this.loading.set(true);
    try {
      const res = await api.get('/store', {
        params: {
          search: this.searchTerm(),
          limit: this.pageSize(),
          offset: this.pageIndex() * this.pageSize(),
          sortBy: this.sortBy(),
          sortOrder: this.sortOrder()
        }
      });
      this.stores.set(res.data.data);
      this.totalRecords.set(res.data.total);
    } catch (err) {
      console.error('Failed to load stores', err);
    } finally {
      this.loading.set(false);
    }
  }

  onPageChange(event: any) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadStores();
  }

  onSortChange(event: any) {
    this.sortBy.set(event.active);
    this.sortOrder.set(event.direction || 'asc');
    this.loadStores();
  }

  viewStore(s: Store) {
    // alert(`Viewing: ${s.productName} - ${s.price}`);
  }

  // Add new store
  addStore() {
    const dialogRef = this.dialog.open(StoreDialog, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) this.loadStores();
    });
  }

  // // Edit existing pricing
  editStore(row: Store) {
    const dialogRef = this.dialog.open(StoreDialog, {
      width: '400px',
      data: { ...row, id: row._id }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) this.loadStores();
    });
  }

  // bulkUpload() {
  //   // Open file dialog or use Angular Material File Input
  //   console.log('Bulk upload clicked');
  // }
}

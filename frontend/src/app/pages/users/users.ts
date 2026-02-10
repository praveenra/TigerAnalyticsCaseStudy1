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
import { UserDialog } from './user-dialog/user-dialog';
import api from '../../core/services/axios-instance';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  assignedStores: Array<string>;
  isActive: boolean;
}

@Component({
  selector: 'app-users',
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
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class UsersTab implements OnInit, OnChanges {

  constructor(private dialog: MatDialog) {}

  @Input() active: boolean = false;

  users = signal<User[]>([]);
  loading = signal(false);
  searchTerm = signal('');

  displayedColumns: string[] = ['name', 'email', 'role', 'isActive', 'actions'];
  pageIndex = signal(0);
  pageSize = signal(5);
  totalRecords = signal(0);
  sortBy = signal('createdAt');
  sortOrder = signal<'asc' | 'desc'>('desc');

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.loadUsers();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['active'] && this.active) {
      // Tab became active
      this.loadUsers();
      this.loading.set(true); // remove this line if you want reload every time tab is selected
    }
  }

  async loadUsers() {
    this.loading.set(true);
    try {
      const res = await api.get('/user', {
        params: {
          search: this.searchTerm(),
          limit: this.pageSize(),
          offset: this.pageIndex() * this.pageSize(),
          sortBy: this.sortBy(),
          sortOrder: this.sortOrder()
        }
      });
      this.users.set(res.data.data);
      this.totalRecords.set(res.data.total);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      this.loading.set(false);
    }
  }

  onPageChange(event: any) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadUsers();
  }

  onSortChange(event: any) {
    this.sortBy.set(event.active);
    this.sortOrder.set(event.direction || 'asc');
    this.loadUsers();
  }

  viewUser(s: User) {
    // alert(`Viewing: ${s.name} - ${s.email}`);
  }

  // Add new user
  addUser() {
    const dialogRef = this.dialog.open(UserDialog, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) this.loadUsers();
    });
  }

  // // Edit existing user
  editUser(row: User) {
    const dialogRef = this.dialog.open(UserDialog, {
      width: '400px',
      data: { ...row, id: row._id }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) this.loadUsers();
    });
  }

  // bulkUpload() {
  //   // Open file dialog or use Angular Material File Input
  //   console.log('Bulk upload clicked');
  // }
}

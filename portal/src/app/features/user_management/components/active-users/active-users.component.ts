import { NgFor } from '@angular/common';
import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { DataTable } from 'simple-datatables';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { ActiveUsersService } from './services/active-users.service';

interface User {
  id: number;
  userId: string;
  name: string;
  userName: string;
  email: string;
  password: string;
  isAdmin: boolean;
  isActive: boolean;
  isLocked: boolean;
  isDeleted: boolean;
  loginAttempts: number;
  deletedStatus: number;
  createdOn: string;
  updatedOn: string | null;
  deletedOn: string | null;
  autoDeletedOn: string | null;
  lastLoginDateTime: string | null;
  lockedUntil: string | null;
  roleId: number;
  salt: string;
}

@Component({
  selector: 'app-active-users',
  standalone: true,
  imports: [NgFor],
  templateUrl: './active-users.component.html',
  styleUrls: ['./active-users.component.css'],
})
export class ActiveUsersComponent implements AfterViewInit, OnDestroy {
  users: any[] = [];
  dataTable: DataTable | undefined;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private activeUsersService: ActiveUsersService
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchActiveUsers();
    }
  }

  ngOnDestroy() {
    // Clean up DataTable instance if it exists
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  }

  fetchActiveUsers(): void {
    this.activeUsersService.getUsersList().subscribe({
      next: (response) => {
        if (response.returnValue && response.returnValue.$values) {
          this.users = response.returnValue.$values.map((user: User) => ({
            name: user.name,
            email: user.email,
            userName: user.userName,
            password: user.password,
          }));

          // Re-initialize DataTable after data is set
          this.initializeDataTable();
        }
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
    });
  }

  initializeDataTable(): void {
    const tableElement = document.getElementById('active-user-table');
    if (tableElement) {
      // Destroy existing instance if any
      if (this.dataTable) {
        this.dataTable.destroy();
      }

      // Initialize new DataTable instance
      this.dataTable = new DataTable(tableElement as HTMLTableElement, {
        searchable: true,
        perPageSelect: [5, 10, 15],
        sortable: true,
        labels: {
          placeholder: 'Search...',
          noRows: 'No entries found',
        },
      });
    }
  }
}

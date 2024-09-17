import { NgClass, NgFor, NgIf } from '@angular/common';
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
  isAdmin: boolean;
  isActive: boolean;
  createdOn: string;
}

@Component({
  selector: 'app-active-users',
  standalone: true,
  imports: [NgFor, NgIf, NgClass],
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

  initializeDataTable(): void {
    const tableElement = document.getElementById('active-user-table');
    if (tableElement) {
      if (this.dataTable) {
        this.dataTable.destroy();
      }

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

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchActiveUsers();
    }
  }

  ngOnDestroy() {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  }

  fetchActiveUsers(): void {
    this.activeUsersService.getUsersList().subscribe({
      next: (response) => {
        if (response.returnValue && response.returnValue.$values) {
          this.users = response.returnValue.$values.map((user: User) => ({
            id: user.id,
            userId: user.userId,
            name: user.name,
            userName: user.userName,
            email: user.email,
            isAdmin: user.isAdmin,
            isActive: user.isActive,
            createdOn: user.createdOn,
          }));

          setTimeout(() => {
            this.initializeDataTable();
          }, 0);
        }
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
    });
  }

  editUser(id: number) {
    console.log('Edit user with ID:', id);
  }

  deleteUser(id: number) {
    console.log('Delete user with ID:', id);
  }

  getRoleName(role: boolean): string {
    switch (role) {
      case true:
        return 'Super Admin';
      case false:
        return 'Admin';
      default:
        return 'Unknown';
    }
  }
}

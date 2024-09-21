import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { DataTable } from 'simple-datatables';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { ActiveUsersService } from './services/active-users.service';
import { Router, RouterModule } from '@angular/router';

interface User {
  id: number;
  userId: string;
  name: string;
  userName: string;
  email: string;
  isAdmin: boolean;
  isActive: boolean;
  isLocked: boolean;
  roleId: number;
  createdOn: string;
}

@Component({
  selector: 'app-active-users',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, RouterModule],
  templateUrl: './active-users.component.html',
  styleUrls: ['./active-users.component.css'],
})
export class ActiveUsersComponent implements AfterViewInit, OnDestroy {
  successMessage: string | null = null;
  errorMessage: string | null = null;
  users: any[] = [];
  dataTable: DataTable | undefined;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private activeUsersService: ActiveUsersService,
    private router: Router
  ) {}

  // Clear the messages
  clearMessage(): void {
    this.successMessage = null;
    this.errorMessage = null;
  }

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
          this.users = response.returnValue.$values.map((user: User) => {
            const createdOn = new Date(user.createdOn);
            const formattedDate = `${createdOn.getFullYear()}-${(
              createdOn.getMonth() + 1
            )
              .toString()
              .padStart(2, '0')}-${createdOn
              .getDate()
              .toString()
              .padStart(2, '0')} ${createdOn
              .getHours()
              .toString()
              .padStart(2, '0')}:${createdOn
              .getMinutes()
              .toString()
              .padStart(2, '0')}:${createdOn
              .getSeconds()
              .toString()
              .padStart(2, '0')}`;
            return {
              id: user.id,
              userId: user.userId,
              name: user.name,
              userName: user.userName,
              email: user.email,
              isAdmin: user.isAdmin,
              isActive: user.isActive,
              isLocked: user.isLocked,
              roleId: user.roleId,
              createdOn: formattedDate,
            };
          });

          if (this.users.length === 0) {
            console.log('No active users found');
          } else {
            setTimeout(() => {
              this.initializeDataTable();
            }, 0);
          }
        }
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
    });
  }

  createUser() {
    this.router.navigate(['/user-management/create-user']);
  }

  toggleLock(userId: string) {}

  editUser(id: number) {
    console.log('Edit user with ID:', id);
  }

  deleteUser(id: number) {
    console.log('Delete user with ID:', id);
  }
}

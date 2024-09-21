import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { DataTable } from 'simple-datatables';
import { InactiveUsersService } from './services/inactive-users.service';
import { MessageService } from '../../services/message.service';
import { Router } from '@angular/router';
import { LoaderService } from '../../../../shared/services/loader.service';
import { isPlatformBrowser } from '@angular/common';

interface User {
  id: number;
  userId: string;
  name: string;
  userName: string;
  email: string;
  isActive: boolean;
  roleId: number;
  deletedOn: string;
  autoDeletedOn: string;
}

@Component({
  selector: 'app-inactive-users',
  standalone: true,
  imports: [],
  templateUrl: './inactive-users.component.html',
  styleUrl: './inactive-users.component.css',
})
export class InactiveUsersComponent {
  successMessage: string | null = null;
  errorMessage: string | null = null;
  users: any[] = [];
  dataTable: DataTable | undefined;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private inactiveUsersService: InactiveUsersService,
    private messageService: MessageService,
    private router: Router,
    private loaderService: LoaderService
  ) {}

  initializeDataTable(): void {
    const tableElement = document.getElementById('inactive-user-table');
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
      this.fetchInactiveUsers();
    }
  }

  ngOnDestroy() {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  }

  fetchInactiveUsers(): void {
    this.inactiveUsersService.getDeletedUsersList().subscribe({
      next: (response) => {
        if (response.returnValue && response.returnValue.$values) {
          this.users = response.returnValue.$values.map((user: User) => {
            const deletedOn = new Date(user.deletedOn);
            const formattedDate = `${deletedOn.getFullYear()}-${(
              deletedOn.getMonth() + 1
            )
              .toString()
              .padStart(2, '0')}-${deletedOn
              .getDate()
              .toString()
              .padStart(2, '0')} ${deletedOn
              .getHours()
              .toString()
              .padStart(2, '0')}:${deletedOn
              .getMinutes()
              .toString()
              .padStart(2, '0')}:${deletedOn
              .getSeconds()
              .toString()
              .padStart(2, '0')}`;

            const autoDeletedOn = new Date(user.autoDeletedOn);
            const formattedAutoDeletedOnDate = `${autoDeletedOn.getFullYear()}-${(
              autoDeletedOn.getMonth() + 1
            )
              .toString()
              .padStart(2, '0')}-${autoDeletedOn
              .getDate()
              .toString()
              .padStart(2, '0')} ${autoDeletedOn
              .getHours()
              .toString()
              .padStart(2, '0')}:${autoDeletedOn
              .getMinutes()
              .toString()
              .padStart(2, '0')}:${autoDeletedOn
              .getSeconds()
              .toString()
              .padStart(2, '0')}`;
            return {
              id: user.id,
              userId: user.userId,
              name: user.name,
              userName: user.userName,
              email: user.email,
              isActive: user.isActive,
              roleId: user.roleId,
              deletedOn: formattedDate,
              autoDeletedOn: formattedAutoDeletedOnDate,
            };
          });

          if (this.users.length === 0) {
            console.log('No inactive users found');
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
}

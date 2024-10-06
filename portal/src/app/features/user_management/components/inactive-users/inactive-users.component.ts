import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { DataTable } from 'simple-datatables';
import { InactiveUsersService } from './services/inactive-users.service';
import { MessageService } from '../../services/message.service';
import { Router } from '@angular/router';
import { LoaderService } from '../../../../shared/services/loader.service';
import { isPlatformBrowser, NgClass, NgFor, NgIf } from '@angular/common';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';

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

interface ApiResponse {
  responseCode: number;
  successMessage: string;
  errorMessage: string;
  statusCode: number;
}

@Component({
  selector: 'app-inactive-users',
  standalone: true,
  imports: [NgIf, NgClass, NgFor, ConfirmationDialogComponent],
  templateUrl: './inactive-users.component.html',
  styleUrl: './inactive-users.component.css',
})
export class InactiveUsersComponent implements AfterViewInit, OnDestroy {
  successMessage: string | null = null;
  errorMessage: string | null = null;
  users: any[] = [];
  dataTable: DataTable | undefined;
  message: string = '';
  showRestoreUserConfirmationDialog = false;
  userIdRestoreSoftDelete: number | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private inactiveUsersService: InactiveUsersService,
    private messageService: MessageService,
    private router: Router,
    private loaderService: LoaderService
  ) {}

  // Clear the messages
  clearMessage(): void {
    this.successMessage = null;
    this.errorMessage = null;
    this.messageService.clearMessage();
  }

  initializeDataTable(): void {
    const tableElement = document.getElementById('inactive-user-table');
    if (tableElement) {
      if (this.dataTable) {
        this.dataTable.destroy();
      }

      // Initialize the DataTable
      this.dataTable = new DataTable(tableElement as HTMLTableElement, {
        searchable: true,
        perPageSelect: [5, 10, 15],
        sortable: true,
        labels: {
          placeholder: 'Search users...',
          noRows: 'No active users found',
          info: 'Showing {start} to {end} of {rows} entries',
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

  restoreUser(userId: number) {
    this.message = 'Do you want to restore this user?';
    this.userIdRestoreSoftDelete = userId;
    this.showRestoreUserConfirmationDialog = true;
  }

  onConfirmRestoreUser() {
    if (this.userIdRestoreSoftDelete) {
      this.loaderService.show();
      this.inactiveUsersService
        .restoreSoftDeletedUser(this.userIdRestoreSoftDelete)
        .subscribe({
          next: (response: ApiResponse) => {
            if (response.responseCode === 1) {
              this.successMessage = response.successMessage;
            } else {
              this.errorMessage = response.errorMessage;
            }
            this.showRestoreUserConfirmationDialog = false;
            this.loaderService.hide();
          },
          error: (error) => {
            console.error(error);
            this.showRestoreUserConfirmationDialog = false;
            this.loaderService.hide();
          },
        });
    }
  }

  clearConfirmationDialog() {
    this.showRestoreUserConfirmationDialog = false;
  }
}

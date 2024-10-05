import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { DataTable } from 'simple-datatables';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { ActiveUsersService } from './services/active-users.service';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { LoaderService } from '../../../../shared/services/loader.service';
import { FormsModule } from '@angular/forms';
import { InUpdateUserDetails } from '../../models/InUpdateUserDetails';

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

interface ApiResponse {
  responseCode: number;
  successMessage: string;
  errorMessage: string;
  statusCode: number;
}

@Component({
  selector: 'app-active-users',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    NgClass,
    RouterModule,
    ConfirmationDialogComponent,
    FormsModule,
  ],
  templateUrl: './active-users.component.html',
  styleUrls: ['./active-users.component.css'],
})
export class ActiveUsersComponent implements AfterViewInit, OnDestroy {
  successMessage: string | null = null;
  errorMessage: string | null = null;
  users: User[] = [];
  dataTable: DataTable | undefined;
  showSoftDeleteConfirmationDialog = false;
  showHardDeleteConfirmationDialog = false;
  showLockunlockConfirmationDialog = false;
  showEditUserDetailsConfirmationDialog = false;
  userIdToDelete: number | null = null;
  userIdToSoftDelete: number | null = null;
  message: string = '';
  userIdToLockUnlock: number | null = null;
  userIdToEditUserDetails: number | null = null;
  isEditUserModalVisible = false;
  editedUser: InUpdateUserDetails = {
    id: 0,
    name: '',
    userName: '',
    email: '',
  };
  usernameErrorMessage: string | null = null;
  emailErrorMessage: string | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private activeUsersService: ActiveUsersService,
    private messageService: MessageService,
    private router: Router,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    // Subscribe to message service for displaying alerts
    this.messageService.message$.subscribe((message) => {
      if (message) {
        if (message.success) {
          this.successMessage = message.success;
          console.log('Success message:', this.successMessage);
          setTimeout(() => this.clearMessage(), 3000);
        }
        if (message.error) {
          this.errorMessage = message.error;
          console.error('Error message:', this.errorMessage);
          setTimeout(() => this.clearMessage(), 3000);
        }
      }
    });
  }

  clearMessage(): void {
    this.successMessage = null;
    this.errorMessage = null;
    this.messageService.clearMessage();
  }

  initializeDataTable(): void {
    const tableElement = document.getElementById('active-user-table');
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
            console.warn('No active users found.');
          } else {
            setTimeout(() => {
              this.initializeDataTable();
            }, 0);
          }
        }
      },
      error: (error) => {
        this.errorMessage = 'Failed to load active users';
        console.error('Error fetching active users:', error);
      },
    });
  }

  createUser() {
    this.router.navigate(['/user-management/create-user']);
  }

  toggleLock(userId: number) {
    this.message = 'Do you want to lock/unlock this user?';
    this.userIdToLockUnlock = userId;
    this.showLockunlockConfirmationDialog = true;
  }

  onConfirmLockUnlockUser() {
    if (this.userIdToLockUnlock) {
      this.loaderService.show();
      this.activeUsersService
        .lockUnlockUser(this.userIdToLockUnlock)
        .subscribe({
          next: (response: ApiResponse) => {
            if (response.responseCode === 1) {
              this.successMessage = response.successMessage;
            } else {
              this.errorMessage = response.errorMessage;
            }
            this.showLockunlockConfirmationDialog = false;
            this.loaderService.hide();
          },
          error: (error) => {
            console.error(error);
            this.showLockunlockConfirmationDialog = false;
            this.loaderService.hide();
          },
        });
    }
  }

  editUser(userId: number) {
    this.message = 'Do you want to edit user details?';
    this.userIdToEditUserDetails = userId;
    this.showEditUserDetailsConfirmationDialog = true;
  }

  onConfirmEditUserDetails() {
    const userToEdit = this.users.find(
      (user) => user.id === this.userIdToEditUserDetails
    );
    if (userToEdit) {
      this.editedUser = { ...userToEdit };
      this.isEditUserModalVisible = true;
    }
  }

  onSaveEditUser() {
    const updateUserPayload: InUpdateUserDetails = {
      id: this.editedUser.id,
      name: this.editedUser.name,
      userName: this.editedUser.userName,
      email: this.editedUser.email,
    };

    // Show a loader while saving user details
    this.loaderService.show();

    // Call the API to update the user details
    this.activeUsersService.updateUserDetails(updateUserPayload).subscribe(
      (response: any) => {
        // Hide loader once response is received
        this.loaderService.hide();

        if (response.responseCode === 1) {
          // Show success message and update the user list
          this.successMessage = response.successMessage;

          // Close the modal
          this.closeEditUserModal();
        } else if (response.responseCode === 2) {
          this.emailErrorMessage = response.errorMessage;
        } else if (response.responseCode === 3) {
          this.usernameErrorMessage = response.errorMessage;
        } else {
          // Handle error and show error message
          this.errorMessage =
            response.errorMessage || 'Failed to update user details';
          // Close the modal
          this.closeEditUserModal();
        }
      },
      (error) => {
        // Hide loader and show error message in case of a failure
        this.loaderService.hide();
        this.errorMessage = 'An error occurred while updating the user details';
        this.messageService.setMessage(this.errorMessage);
        console.error('Error updating user:', error);
      }
    );
  }

  // Method to close modal without saving
  closeEditUserModal() {
    this.isEditUserModalVisible = false;
    this.showEditUserDetailsConfirmationDialog = false;
    this.usernameErrorMessage = '';
    this.emailErrorMessage = '';
  }

  // Method to handle soft delete
  softDeleteUser(userId: number) {
    this.message = 'Do you want to soft delete this user?';
    this.userIdToSoftDelete = userId;
    this.showSoftDeleteConfirmationDialog = true;
  }

  onConfirmSoftDelete() {
    if (this.userIdToSoftDelete) {
      this.loaderService.show();
      this.activeUsersService
        .softDeleteUser(this.userIdToSoftDelete)
        .subscribe({
          next: (response: ApiResponse) => {
            if (response.responseCode === 1) {
              this.successMessage = response.successMessage;
            } else {
              this.errorMessage = response.errorMessage;
            }
            this.showLockunlockConfirmationDialog = false;
            this.loaderService.hide();
          },
          error: (error) => {
            console.error(error);
            this.showLockunlockConfirmationDialog = false;
            this.loaderService.hide();
          },
        });
    }
  }

  // Method to handle hard delete
  hardDeleteUser(userId: number) {
    this.message = 'Do you want to permanently delete this user?';
    this.showHardDeleteConfirmationDialog = true;
  }

  onConfirmHardDelete() {}

  clearConfirmationDialog() {
    this.showSoftDeleteConfirmationDialog = false;
    this.showEditUserDetailsConfirmationDialog = false;
    this.showHardDeleteConfirmationDialog = false;
    this.showLockunlockConfirmationDialog = false;
  }
}

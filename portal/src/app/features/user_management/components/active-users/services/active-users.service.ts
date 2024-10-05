import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserManagementService } from '../../../../../infrastructure/user-management.service';
import { Observable } from 'rxjs';

interface ApiResponse {
  responseCode: number;
  successMessage: string;
  errorMessage: string;
  statusCode: number;
}

@Injectable({
  providedIn: 'root',
})
export class ActiveUsersService {
  constructor(
    private router: Router,
    private userManagementService: UserManagementService
  ) {}

  // Handle the fetching users
  getUsersList(): Observable<any> {
    return new Observable((observer) => {
      this.userManagementService.getUsersList().subscribe({
        next: (response) => {
          this.handleGetUsersSuccess();
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          this.handleGetUsersError(error);
          observer.error(error);
        },
      });
    });
  }

  // Handle fetching users success
  private handleGetUsersSuccess(): void {
    this.router.navigate(['/user-management/active-users']);
  }

  // Handle fetching users error
  private handleGetUsersError(error: any): void {
    console.error('Error occurred while getting users list:', error);
  }

  createNewUser(inCreateUser: any) {
    return new Observable((observer) => {
      this.userManagementService.createNewUser(inCreateUser).subscribe({
        next: (response) => {
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          this.handleCreateNewUserError(error);
          observer.error(error);
        },
      });
    });
  }

  public handleCreateNewUserSuccess(): void {
    this.router.navigate(['/user-management/active-users']);
  }

  // Handle create new user error
  private handleCreateNewUserError(error: any): void {
    console.error('Error occurred while creating new user:', error);
  }

  updateUserDetails(inUpdateUserDetails: any) {
    return new Observable((observer) => {
      this.userManagementService
        .updateUserDetails(inUpdateUserDetails)
        .subscribe({
          next: (response) => {
            observer.next(response);
            observer.complete();
          },
          error: (error) => {
            this.handleUpdateUserDetailsError(error);
            observer.error(error);
          },
        });
    });
  }

  // Handle create new user error
  private handleUpdateUserDetailsError(error: any): void {
    console.error('Error occurred while updating user details:', error);
  }

  lockUnlockUser(id: number): Observable<ApiResponse> {
    return new Observable<ApiResponse>((observer) => {
      this.userManagementService.lockUnlockUser(id).subscribe({
        next: (response: ApiResponse) => {
          // Add correct type here
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          this.handleLockUnlockUserError(error);
          observer.error(error);
        },
      });
    });
  }

  // Handle locking/unlocking user error
  private handleLockUnlockUserError(error: any): void {
    console.error('Error occurred while locking/unlocking user:', error);
  }

  softDeleteUser(id: number): Observable<ApiResponse> {
    return new Observable<ApiResponse>((observer) => {
      this.userManagementService.softDeleteUser(id).subscribe({
        next: (response: ApiResponse) => {
          // Add correct type here
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          this.handleSoftDeleteUserError(error);
          observer.error(error);
        },
      });
    });
  }

  // Handle locking/unlocking user error
  private handleSoftDeleteUserError(error: any): void {
    console.error('Error occurred while soft deletion user:', error);
  }
}

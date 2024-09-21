import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserManagementService } from '../../../../../infrastructure/user-management.service';
import { Observable } from 'rxjs';

interface LockUnlockResponse {
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

  lockUnlockUser(id: number): Observable<LockUnlockResponse> {
    return new Observable<LockUnlockResponse>((observer) => {
      this.userManagementService.lockUnlockUser(id).subscribe({
        next: (response: LockUnlockResponse) => {
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
}

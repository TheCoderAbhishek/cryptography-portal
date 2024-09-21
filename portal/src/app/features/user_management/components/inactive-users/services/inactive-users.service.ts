import { Injectable } from '@angular/core';
import { UserManagementService } from '../../../../../infrastructure/user-management.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InactiveUsersService {
  constructor(
    private router: Router,
    private userManagementService: UserManagementService
  ) {}

  // Handle the fetching users
  getDeletedUsersList(): Observable<any> {
    return new Observable((observer) => {
      this.userManagementService.getDeletedUsersList().subscribe({
        next: (response) => {
          this.handleGetDeletedUsersSuccess();
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          this.handleGetDeletedUsersError(error);
          observer.error(error);
        },
      });
    });
  }

  // Handle fetching soft deleted users success
  private handleGetDeletedUsersSuccess(): void {
    this.router.navigate(['/user-management/inactive-users']);
  }

  // Handle fetching soft deleted users error
  private handleGetDeletedUsersError(error: any): void {
    console.error(
      'Error occurred while getting soft deleted users list:',
      error
    );
  }
}

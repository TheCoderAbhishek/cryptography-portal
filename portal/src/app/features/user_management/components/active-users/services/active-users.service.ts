import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserManagementService } from '../../../../../infrastructure/user-management.service';
import { Observable } from 'rxjs';

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
}

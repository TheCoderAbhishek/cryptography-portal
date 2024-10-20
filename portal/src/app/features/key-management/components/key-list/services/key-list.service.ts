import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { KeyManagementService } from '../../../../../infrastructure/key-management.service';

interface ApiResponse {
  responseCode: number;
  successMessage: string;
  errorMessage: string;
  statusCode: number;
}

@Injectable({
  providedIn: 'root',
})
export class KeyListService {
  constructor(
    private router: Router,
    private keyManagementService: KeyManagementService
  ) {}

  // Handle the fetching users
  getKeysList(): Observable<any> {
    return new Observable((observer) => {
      this.keyManagementService.getKeysList().subscribe({
        next: (response) => {
          this.handleGetKeysListSuccess();
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          this.handleGetKeysListError(error);
          observer.error(error);
        },
      });
    });
  }

  // Handle fetching users success
  private handleGetKeysListSuccess(): void {
    this.router.navigate(['/key-management/key-list']);
  }

  // Handle fetching users error
  private handleGetKeysListError(error: any): void {
    console.error('Error occurred while getting keys list:', error);
  }
}

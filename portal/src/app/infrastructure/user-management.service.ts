import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environment/environment';
import { catchError, from, map, Observable } from 'rxjs';
import axios from 'axios';
import { isPlatformBrowser } from '@angular/common';

interface GetUsersListResponse {}

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  private apiUrl = `${environment.apiBaseUrl}/Account/`;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  getUsersList(): Observable<GetUsersListResponse> {
    const token = this.getToken();

    return from(
      axios.get<GetUsersListResponse>(`${this.apiUrl}GetUsersAsync`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    ).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.error(
          'Error occurred during getting users list:',
          error.response ? error.response.data : error.message
        );
        throw error;
      })
    );
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return sessionStorage.getItem('authToken');
    }
    return null;
  }
}

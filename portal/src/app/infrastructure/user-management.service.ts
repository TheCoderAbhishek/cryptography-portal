import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { catchError, from, map, Observable } from 'rxjs';
import axios from 'axios';

interface GetUsersListResponse {}

interface CreateUserResponse {}

interface LockUnlockResponse {
  responseCode: number;
  successMessage: string;
  errorMessage: string;
  statusCode: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  private apiUrl = `${environment.apiBaseUrl}/UserManagement/`;

  constructor() {}

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

  createNewUser(inCreateUser: any): Observable<CreateUserResponse> {
    const token = this.getToken();

    return from(
      axios.post<CreateUserResponse>(
        `${this.apiUrl}CreateNewUserAsync`,
        inCreateUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
    ).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.error(
          'Error occurred during creating new user.:',
          error.response ? error.response.data : error.message
        );
        throw error;
      })
    );
  }

  lockUnlockUser(id: number): Observable<LockUnlockResponse> {
    const token = this.getToken();

    return from(
      axios.put<LockUnlockResponse>(
        `${this.apiUrl}LockUnlockUserAsync/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
    ).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.error(
          'Error occurred during locking/unlocking user:',
          error.response ? error.response.data : error.message
        );
        throw error;
      })
    );
  }

  getToken(): string | null {
    return sessionStorage.getItem('authToken');
  }
}

import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { catchError, from, map, Observable } from 'rxjs';
import axios from 'axios';

interface GetUsersListResponse {}

interface GetDeletedUsersListResponse {}

interface CreateUserResponse {}

interface UpdateUserDetailsResponse {}

interface ApiResponse {
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

  getDeletedUsersList(): Observable<GetDeletedUsersListResponse> {
    const token = this.getToken();

    return from(
      axios.get<GetDeletedUsersListResponse>(
        `${this.apiUrl}GetDeletedUsersAsync`,
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
          'Error occurred during getting soft deleted users list:',
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

  updateUserDetails(
    inUpdateUserDetails: any
  ): Observable<UpdateUserDetailsResponse> {
    const token = this.getToken();

    return from(
      axios.put<UpdateUserDetailsResponse>(
        `${this.apiUrl}UpdateUserDetailsAsync`,
        inUpdateUserDetails,
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
          'Error occurred during updating user details.:',
          error.response ? error.response.data : error.message
        );
        throw error;
      })
    );
  }

  lockUnlockUser(id: number): Observable<ApiResponse> {
    const token = this.getToken();

    return from(
      axios.put<ApiResponse>(
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

  softDeleteUser(id: number): Observable<ApiResponse> {
    const token = this.getToken();

    return from(
      axios.patch<ApiResponse>(
        `${this.apiUrl}SoftDeleteUserAsync/${id}`,
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
          'Error occurred during soft deletion of user:',
          error.response ? error.response.data : error.message
        );
        throw error;
      })
    );
  }

  hardDeleteUser(id: number): Observable<ApiResponse> {
    const token = this.getToken();

    return from(
      axios.delete<ApiResponse>(`${this.apiUrl}HardDeleteUserAsync/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    ).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.error(
          'Error occurred during hard deletion of user:',
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

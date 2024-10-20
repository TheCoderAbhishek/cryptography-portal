import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { catchError, from, map, Observable } from 'rxjs';
import axios from 'axios';

interface GetKeysListResponse {}

interface ApiResponse {
  responseCode: number;
  successMessage: string;
  errorMessage: string;
  statusCode: number;
}

@Injectable({
  providedIn: 'root',
})
export class KeyManagementService {
  private apiUrl = `${environment.apiBaseUrl}/KeyManagement/`;

  constructor() {}

  getKeysList(): Observable<GetKeysListResponse> {
    const token = this.getToken();

    return from(
      axios.get<GetKeysListResponse>(`${this.apiUrl}GetKeysListAsync`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    ).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.error(
          'Error occurred during getting keys list:',
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

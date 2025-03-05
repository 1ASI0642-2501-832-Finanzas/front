import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.apiUrl; // URL base del backend

  constructor(private http: HttpClient) { }

  getUserInfo(identifier: string) {
    return this.http.get(`${this.apiUrl}/account/${identifier}`);
  }
}

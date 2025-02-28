import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(userData: {email:string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  login(credentials: { password: string; email: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((response: any) => {
        this.saveToken(response.token);
        this.saveUserIdentifier(response.userIdentifier);
      })
    );
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  saveUserIdentifier(userIdentifier: string): void {
    localStorage.setItem('userIdentifier', userIdentifier);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userIdentifier');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserIdentifier(): string | null {
    return localStorage.getItem('userIdentifier');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

}

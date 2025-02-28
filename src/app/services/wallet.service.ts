import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Wallet } from '../models/wallet';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private apiUrl = environment.apiUrl; // URL base del backend

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getWallets(userIdentifier: string): Observable<Wallet[]> {
    return this.http.get<Wallet[]>(`${this.apiUrl}/wallet/users/${userIdentifier}`, {
      headers: this.getAuthHeaders()
    });
  }

  getWalletById(id: number): Observable<Wallet> {
    return this.http.get<Wallet>(`${this.apiUrl}/wallet/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  createWallet(wallet: Omit<Wallet, 'id'>, userIdentifier: string): Observable<Wallet> {
    return this.http.post<Wallet>(`${this.apiUrl}/wallet`, { ...wallet, userIdentifier }, {
      headers: this.getAuthHeaders()
    });
  }

  deleteWallet(walletId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/wallet/${walletId}`, {
      headers: this.getAuthHeaders()
    });
  }

  updateWallet(wallet: Wallet): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/wallet/${wallet.id}`, wallet, {
      headers: this.getAuthHeaders()
    });
  }
}

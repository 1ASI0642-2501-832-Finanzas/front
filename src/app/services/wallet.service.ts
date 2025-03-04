import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Wallet } from '../models/wallet';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private apiUrl = environment.apiUrl; // URL base del backend

  constructor(private http: HttpClient) {}

  getWallets(userIdentifier: string): Observable<Wallet[]> {
    return this.http.get<Wallet[]>(`${this.apiUrl}/wallet/users/${userIdentifier}`);
  }

  updateWallet(walletId: number, wallet: any): Observable<Wallet> {
    return this.http.put<Wallet>(`${this.apiUrl}/wallet/${walletId}`, wallet);
  }

  getWalletById(id: number): Observable<Wallet> {
    return this.http.get<Wallet>(`${this.apiUrl}/wallet/${id}`);
  }

  createWallet(wallet: Omit<Wallet, 'id'>, userIdentifier: string): Observable<Wallet> {
    return this.http.post<Wallet>(`${this.apiUrl}/wallet`, { ...wallet, userIdentifier });
  }

  deleteWallet(walletId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/wallet/${walletId}`);
  }

  /**
   * Genera un reporte PDF para una billetera
   * @param walletId ID de la billetera
   */
  generateWalletReport(walletId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/wallet/${walletId}/report`, {
      responseType: 'blob' // Recibe el archivo en formato Blob
    });
  }
}

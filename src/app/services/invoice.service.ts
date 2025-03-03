import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice } from '../models/invoice';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = environment.apiUrl; // URL base del backend

  constructor(private http: HttpClient) {}

  getInvoicesByWallet(walletId: number): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/invoice/all/${walletId}`);
  }

  getInvoiceById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/invoice/${id}`);
  }

  createInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.apiUrl}/invoice`, invoice);
  }

  updateInvoice(id: number, invoice: any): Observable<Invoice> {
    return this.http.put<Invoice>(`${this.apiUrl}/invoice/${id}`, invoice);
  }

  deleteInvoice(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/invoice/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice } from '../models/invoice';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = `${environment.apiUrl}/invoice`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene una factura por su ID
   * @param id Identificador de la factura
   */
  getInvoiceById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea una nueva factura
   * @param invoice Datos de la factura
   */
  createInvoice(invoice: Omit<Invoice, 'id'>): Observable<Invoice> {
    return this.http.post<Invoice>(this.apiUrl, invoice);
  }

  /**
   * Actualiza una factura existente
   * @param id Identificador de la factura
   * @param invoice Datos actualizados de la factura
   */
  updateInvoice(id: number, invoice: Invoice): Observable<Invoice> {
    return this.http.put<Invoice>(`${this.apiUrl}/${id}`, invoice);
  }

  /**
   * Elimina una factura por su ID
   * @param id Identificador de la factura
   */
  deleteInvoice(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

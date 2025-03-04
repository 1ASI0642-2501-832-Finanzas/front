import { Component, OnInit } from '@angular/core';
import { Invoice } from '../models/invoice';
import { InvoiceService } from '../services/invoice.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { InvoiceDialogComponent } from './invoice-dialog/invoice-dialog.component';

@Component({
  selector: 'app-invoice',
  standalone: false,
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  invoices: Invoice[] = [];
  walletId!: number; // ID de la wallet actual

  constructor(
    private invoiceService: InvoiceService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = Number(params['walletId']);
      if (!id) {
        console.error('No se encontró un walletId válido en la URL');
        return;
      }
      this.walletId = id;
      this.getInvoices();
    });
  }

  getInvoices(): void {
    this.invoiceService.getInvoicesByWallet(this.walletId).subscribe({
      next: (data) => {
        this.invoices = data;
        console.log(`Facturas obtenidas para wallet ${this.walletId}:`, data);
      },
      error: (err) => console.error('Error al obtener facturas:', err)
    });
  }

  deleteInvoice(invoiceId: number): void {
    this.invoiceService.deleteInvoice(invoiceId).subscribe({
      next: () => {
        console.log(`Factura con ID ${invoiceId} eliminada con éxito`);
        this.getInvoices();
      },
      error: (err) => console.error('Error al eliminar factura:', err)
    });
  }

  openInvoiceDialog(invoice?: Invoice): void {
    const dialogRef = this.dialog.open(InvoiceDialogComponent, {
      width: '60vw',
      maxWidth: 'none',
      disableClose: true,
      data: { invoice: invoice || {}, walletId: this.walletId } // Pasamos walletId para asociar la factura
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getInvoices(); // Recargar facturas después de guardar
      }
    });
  }

  viewInvoice(invoice: Invoice): void {
    this.dialog.open(InvoiceDialogComponent, {
      width: '60vw',
      maxWidth: 'none',
      disableClose: false,
      data: { invoice, isViewMode: true } // Modo solo lectura
    });
  }
}

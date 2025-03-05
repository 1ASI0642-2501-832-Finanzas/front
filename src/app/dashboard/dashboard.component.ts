import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import Chart from 'chart.js/auto';
import {Router} from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceDialogComponent } from '../invoice/invoice-dialog/invoice-dialog.component';


@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  user: any = {};
  userIdentifier!: string;
  totalWallets: number = 0;
  expiredWallets: number = 0;
  wallets: any[] = [];
  selectedWalletId!: number;
  pendingInvoices: any[] = [];
  completedInvoices: any[] = [];
  tceaChart!: Chart;
  statusChart!: Chart;

  constructor(private http: HttpClient,  private router: Router,    private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadUserIdentifier();

  }

  ngAfterViewInit(): void {
    this.initTceaChart();
    this.initStatusChart();
  }

  loadUserIdentifier(): void {
    const storedUserIdentifier = localStorage.getItem('userIdentifier');

    if (storedUserIdentifier) {
      this.userIdentifier = storedUserIdentifier;
      console.log("✅ userIdentifier obtenido:", this.userIdentifier);
      this.loadUserInfo();
      this.loadWallets();
    } else {
      console.error('❌ No se encontró userIdentifier en el almacenamiento.');
    }
  }


  loadUserInfo(): void {
    this.http.get<any>(`${environment.apiUrl}/account/${this.userIdentifier}`).subscribe(
      (data) => {
        this.user = data;
      },
      (error) => {
        console.error('❌ Error al obtener usuario', error);
      }
    );
  }


  loadWallets(): void {
    this.http.get<any[]>(`${environment.apiUrl}/wallet/users/${this.userIdentifier}`).subscribe(
      (data) => {
        this.wallets = data;
        this.totalWallets = data.length;
        this.expiredWallets = data.filter(wallet => new Date(wallet.discountDate) < new Date()).length;

        console.log("📂 Carteras obtenidas:", this.wallets);

        if (this.wallets.length > 0) {
          this.selectedWalletId = this.wallets[0].id;
          console.log("🔄 Cargando facturas para cartera ID:", this.selectedWalletId);
          this.loadInvoices(this.selectedWalletId);
        }
      },
      (error) => {
        console.error("❌ Error al cargar las carteras", error);
      }
    );
  }

  loadInvoices(walletId: number): void {
    console.log("📥 Solicitando facturas para cartera ID:", walletId);

    this.http.get<any[]>(`${environment.apiUrl}/invoice/all/${walletId}`).subscribe(
      (data) => {
        this.pendingInvoices = data.filter(invoice => invoice.status === 'En progreso');
        this.completedInvoices = data.filter(invoice => invoice.status === 'Facturado');

        this.updateCharts();
        console.log("📄 Facturas obtenidas:", data);
        console.log("🟠 En Progreso:", this.pendingInvoices.length, this.pendingInvoices);
        console.log("🔵 Facturadas:", this.completedInvoices.length, this.completedInvoices);

        this.updateTceaChart();
      },
      (error) => {
        console.error("❌ Error al cargar las facturas", error);
      }
    );
  }

    getGreeting(): string {
      const hour = new Date().getHours();
      if (hour < 12) {
        return '🌅 Buenos días';
      } else if (hour < 18) {
        return '☀️ Buenas tardes';
      } else {
        return '🌙 Buenas noches';
      }
    }





  onWalletChange(walletId: number): void {
    console.log("🔄 Cartera seleccionada:", walletId);
    this.selectedWalletId = walletId;
    this.loadInvoices(walletId);
  }

  initTceaChart(): void {
    const ctx = document.getElementById('tceaChart') as HTMLCanvasElement;
    if (ctx) {
      this.tceaChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: 'TCEA (%)',
            data: [],
            borderColor: '#36A2EB',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: true
          }]
        }
      });
    }
  }

  initStatusChart(): void {
    const ctx = document.getElementById('statusChart') as HTMLCanvasElement;
    if (ctx) {
      this.statusChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Pendientes', 'Facturadas'],
          datasets: [{
            data: [0, 0], // Se actualizará después
            backgroundColor: ['rgba(255,154,37,0.84)', 'rgba(27,255,90,0.72)']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,  // 🔹 Permite ajustar manualmente el tamaño
          plugins: {
            legend: {
              position: 'top',
              labels: {
                font: {
                  size: 15
                }
              }
            }
          }
        }
      });
    }
  }


  updateCharts(): void {
    this.statusChart.data.datasets[0].data = [this.pendingInvoices.length, this.completedInvoices.length];
    this.statusChart.update();
  }


  updateTceaChart(): void {
    if (this.tceaChart) {
      // 🔹 Ver datos sin procesar
      console.log("📊 Datos originales de facturas en progreso:", this.pendingInvoices);

      // 🔹 Convertir fechas de DD-MM-YYYY a YYYY-MM-DD antes de ordenarlas
      this.pendingInvoices.forEach(inv => {
        const parts = inv.dueDate.split("-"); // Separar la fecha en partes
        if (parts.length === 3) {
          inv.dueDateFormatted = `${parts[2]}-${parts[1]}-${parts[0]}`; // Reorganizar en formato YYYY-MM-DD
        } else {
          console.error("❌ Error al procesar fecha:", inv.dueDate);
        }
      });

      // 🔹 Ordenar facturas por dueDate correctamente
      this.pendingInvoices.sort((a, b) => new Date(a.dueDateFormatted).getTime() - new Date(b.dueDateFormatted).getTime());

      // 🔹 Ver datos ordenados
      console.log("📊 Facturas ordenadas por fecha:", this.pendingInvoices);

      // 🔹 Mapear fechas y valores de TCEA
      const labels = this.pendingInvoices.map(inv => inv.dueDate);
      const tceaValues = this.pendingInvoices.map(inv => inv.tcea);

      // 🔄 Ver las fechas y valores que se enviarán al gráfico
      console.log("📆 Fechas en el gráfico:", labels);
      console.log("📈 Valores de TCEA en el gráfico:", tceaValues);

      // 🔄 Actualizar el gráfico
      this.tceaChart.data.labels = labels;
      this.tceaChart.data.datasets[0].data = tceaValues;
      this.tceaChart.update();
    }
  }



  viewInvoice(invoice: any): void {
    console.log("👁️ Ver detalles de la factura:", invoice);

    // Abre el InvoiceDialogComponent en modo vista
    this.dialog.open(InvoiceDialogComponent, {
      width: '60vw',
      maxWidth: 'none',
      disableClose: false,
      data: { invoice, isViewMode: true } // 📌 Modo solo lectura
    });

  }

  goToAllDocuments(): void {
    console.log("📂 Navegando a la sección de documentos de la cartera seleccionada");

    const walletId = this.selectedWalletId;

    if (!walletId) {
      console.error("❌ Error: No se encontró el ID de la cartera.");
      return;
    }

    // Navegar a la sección de documentos de la cartera
    this.router.navigate([`wallet/${walletId}/invoice`])
      .then(success => {
        if (success) {
          console.log(`✅ Navegación exitosa a wallet/${walletId}/invoice`);
        } else {
          console.error(`❌ Error al navegar a wallet/${walletId}/invoice`);
        }
      })
      .catch(error => console.error("❌ Error en la navegación:", error));
  }


}

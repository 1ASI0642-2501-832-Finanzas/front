import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: any = {};
  totalWallets: number = 0;
  expiredWallets: number = 0;
  pendingInvoices: any[] = [];
  completedInvoices: any[] = [];
  userIdentifier: string = '';
  wallets: any[] = []; // Lista de wallets del usuario

  // 📊 Configuración del gráfico de facturas (Pendientes vs Facturadas)
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
  };

  public pieChartData: ChartData<'pie'> = {
    labels: ['En Progreso', 'Facturado'],
    datasets: [
      {
        data: [0, 0], // Se actualizará dinámicamente
        backgroundColor: ['#FF6384', '#36A2EB'], // Rojo y Azul
      }
    ]
  };

  public pieChartType: 'pie' = 'pie';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUserIdentifier();
  }

  // 🧑‍💻 Obtener información del usuario (carga userIdentifier)
  loadUserIdentifier(): void {
    const storedUserIdentifier = localStorage.getItem('userIdentifier'); // ⚠️ Ajusta si se almacena de otra manera
    if (storedUserIdentifier) {
      this.userIdentifier = storedUserIdentifier;
      this.loadUserInfo();
      this.loadWallets();
    } else {
      console.error('❌ No se encontró userIdentifier en el almacenamiento.');
    }
  }

  // Llamada al endpoint con el email del usuario
  loadUserInfo(): void {
    this.http.get<any>(`${environment.apiUrl}/account/${this.userIdentifier}`).subscribe(
      (data) => {
        this.user = data;
        console.log('✅ Usuario cargado:', this.user);
      },
      (error) => {
        console.error('❌ Error al obtener usuario', error);
      }
    );
  }

  // 💰 Obtener wallets asociadas al usuario
  loadWallets(): void {
    this.http.get<any[]>(`${environment.apiUrl}/wallet/users/${this.userIdentifier}`).subscribe(
      (data) => {
        this.wallets = data;
        this.totalWallets = data.length;
        this.expiredWallets = data.filter(wallet => new Date(wallet.discountDate) < new Date()).length;

        // Si hay al menos una wallet, cargamos las facturas de la primera
        if (this.wallets.length > 0) {
          this.loadInvoices(this.wallets[0].id);
        }
      },
      (error) => {
        console.error("❌ Error al cargar las carteras", error);
      }
    );
  }

  // 📜 Obtener facturas de una wallet específica
  loadInvoices(walletId: number): void {
    this.http.get<any[]>(`${environment.apiUrl}/invoice/all/${walletId}`).subscribe(
      (data) => {
        this.pendingInvoices = data.filter(invoice => invoice.status === 'En proceso');
        this.completedInvoices = data.filter(invoice => invoice.status === 'Facturada');

        // 📊 Actualizar datos del gráfico
        this.pieChartData = {
          labels: ['Pendientes', 'Facturadas'],
          datasets: [
            {
              data: [this.pendingInvoices.length, this.completedInvoices.length],
              backgroundColor: ['#FF6384', '#36A2EB'] // Colores opcionales
            }
          ]
        };
      },
      (error) => {
        console.error("❌ Error al cargar las facturas", error);
      }
    );
  }

  // 🔍 Filtrar solo facturas pendientes
  filterPending(): void {
    this.pendingInvoices = this.pendingInvoices.filter(invoice => invoice.status === 'En proceso');
  }
}

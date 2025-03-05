import { Component } from '@angular/core';
import { Wallet } from '../models/wallet';
import { WalletService } from '../services/wallet.service';
import { AuthService } from '../auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { WalletDialogComponent } from './wallet-dialog/wallet-dialog.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-wallet',
  standalone: false,
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent {
  wallets: Wallet[] = [];

  constructor(
    private walletService: WalletService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getWallets();
  }

  getWallets(): void {
    const userIdentifier = this.authService.getUserIdentifier();

    if (!userIdentifier) {
      console.error('No hay usuario autenticado');
      this.authService.logout();
      return;
    }

    this.walletService.getWallets(userIdentifier).subscribe({
      next: (data) => this.wallets = data, // Actualizamos la lista de wallets
      error: (err) => console.error('Error al obtener carteras:', err)
    });
  }

  deleteWallet(walletId: number): void {
    if (!walletId) {
      console.error('ID de cartera no válido');
      return;
    }

    this.walletService.deleteWallet(walletId).subscribe({
      next: () => {
        console.log(`✅ Cartera con ID ${walletId} eliminada con éxito`);
        this.getWallets(); // Recargamos la lista de wallets
      },
      error: (err) => console.error('Error al eliminar la cartera:', err)
    });
  }

  openWalletDialog(wallet?: Wallet): void {
    const dialogRef = this.dialog.open(WalletDialogComponent, {
      width: '420px',
      disableClose: true,
      data: wallet ? { ...wallet } : {} // Si es edición, pasamos los datos de la wallet
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (wallet?.id) { // Verificamos que wallet y su ID existan
          this.updateWallet(wallet.id, result);
        } else {
          this.saveWallet(result);
        }
      }
    });
  }

  private updateWallet(walletId: number, updatedWallet: Wallet): void {
    this.walletService.updateWallet(walletId, updatedWallet).subscribe({
      next: () => {
        console.log(`✅ Cartera con ID ${walletId} actualizada correctamente`);
        this.getWallets(); // Volvemos a cargar la lista de wallets
      },
      error: (err) => console.error('❌ Error al actualizar la cartera:', err)
    });
  }


  private saveWallet(wallet: Wallet): void {
    const userIdentifier = this.authService.getUserIdentifier();

    if (!userIdentifier) {
      console.error('No hay usuario autenticado');
      this.authService.logout();
      return;
    }

    this.walletService.createWallet(wallet, userIdentifier).subscribe({
      next: () => {
        console.log('✅ Cartera creada con éxito');
        this.getWallets(); // Recargamos la lista de wallets después de la creación
      },
      error: (err: any) => console.error('Error al crear la cartera:', err)
    });
  }

  //NUEVO

  goToInvoice(wallet: Wallet): void {
    console.log("🔎 Wallet recibido:", wallet);

    if (!wallet || !wallet.id) {
      console.error("❌ Error: wallet.id es undefined o inválido");
      return;
    }

    if (!wallet.discountDate) {
      console.warn("⚠️ Advertencia: wallet.discountDate está vacío o undefined");
    }

    this.router.navigate([`wallet/${wallet.id}/invoice`], {
      queryParams: { discountDate: wallet.discountDate }
    })
      .then(success => {
        if (success) {
          console.log(`✅ Navegación exitosa a wallet/${wallet.id}/invoice con fecha de descuento: ${wallet.discountDate}`);
        } else {
          console.error(`❌ Error al navegar a wallet/${wallet.id}/invoice`);
        }
      })
      .catch(error => console.error('Error de navegación:', error));
  }


  downloadReport(walletId: number): void {
    this.walletService.generateWalletReport(walletId).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_wallet_${walletId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        console.log(`📥 Reporte descargado: reporte_wallet_${walletId}.pdf`);
      },
      error: (err) => {
        console.error('❌ Error al descargar el reporte:', err);
      }
    });
  }
}

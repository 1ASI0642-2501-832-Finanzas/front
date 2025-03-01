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

  openWalletDialog(): void {
    const dialogRef = this.dialog.open(WalletDialogComponent, {
      width: '400px',
      disableClose: true,
      data: {} // Enviamos un objeto vacío porque es una nueva cartera
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveWallet(result); // Guardar la cartera cuando el modal se cierre
      }
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

  goToInvoice(walletId: number): void {
    this.router.navigate([`wallet/${walletId}/invoice`])
      .then(success => {
        if (success) {
          console.log(`Navegación exitosa a wallet/${walletId}/invoice`);
        } else {
          console.error(`Error al navegar a wallet/${walletId}/invoice`);
        }
      })
      .catch(error => console.error('Error de navegacion:', error));
  }
}

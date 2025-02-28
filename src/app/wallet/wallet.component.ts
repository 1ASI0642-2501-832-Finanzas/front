import { Component } from '@angular/core';
import { Wallet } from '../models/wallet';
import { WalletService } from '../services/wallet.service';
import { AuthService } from '../auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { WalletDialogComponent } from './wallet-dialog/wallet-dialog.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getWallets(); // Inicializamos la lista de wallets
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
      next: () => this.getWallets(), // Recargamos la lista de wallets
      error: (err) => console.error('Error al eliminar la cartera:', err)
    });
  }

  openWalletDialog(wallet: Wallet | null = null): void {
    const dialogRef = this.dialog.open(WalletDialogComponent, {
      width: '400px',
      disableClose: true,
      data: wallet || {} // Si no hay wallet, se envía un objeto vacío para crear una nueva
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveWallet(result); // Llamamos a saveWallet para crear o actualizar
      }
    });
  }

  private saveWallet(wallet: Wallet): void {
    const userIdentifier = this.authService.getUserIdentifier();

    if (!userIdentifier) {
      console.error('❌ No hay usuario autenticado');
      this.authService.logout();
      return;
    }

    // Decidimos si hacer una creación o actualización según si wallet tiene id
    let request: Observable<Wallet>;

    if (wallet.id) {
      // Si la wallet tiene un id, se actualiza
      request = this.walletService.updateWallet(wallet).pipe(map(() => wallet));
    } else {
      // Si no tiene id, se crea una nueva wallet
      request = this.walletService.createWallet(wallet, userIdentifier);
    }

    console.log('📤 Verificando request antes de suscribirse:', request);

    if (!request || typeof request.subscribe !== 'function') {
      console.error('❌ Error: request no es un Observable.', request);
      return;
    }

    // Realizamos la suscripción al request (creación o actualización)
    request.subscribe({
      next: () => {
        console.log(`✅ Cartera ${wallet.id ? 'actualizada' : 'creada'} con éxito`);
        this.getWallets(); // Recargamos la lista de wallets después de la operación
      },
      error: (err: any) => console.error(`❌ Error al ${wallet.id ? 'actualizar' : 'crear'} la cartera:`, err)
    });
  }
}

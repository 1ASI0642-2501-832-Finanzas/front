import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-wallet-dialog',
  templateUrl: './wallet-dialog.component.html',
  standalone: false,
  styleUrls: ['./wallet-dialog.component.css']
})
export class WalletDialogComponent implements OnInit {
  walletForm!: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<WalletDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data?.id; // Si tiene ID, es edición

    this.walletForm = this.fb.group({
      name: [this.data?.name || '', Validators.required],
      description: [this.data?.description || '', Validators.required],
      discountDate: [this.data?.discountDate ? this.parseDate(this.data.discountDate) : null, Validators.required]

    });
  }

  // ✅ Convierte una fecha en formato "DD-MM-YYYY" a un objeto Date
  private parseDate(dateString?: string): Date | null {
    if (!dateString) return null;

    const parts = dateString.split('-'); // Divide en [DD, MM, YYYY]
    if (parts.length !== 3) return null;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Los meses en JS empiezan desde 0
    const year = parseInt(parts[2], 10);

    return new Date(year, month, day);
  }


  // ✅ Método para convertir la fecha en formato DD-MM-YYYY
  private formatDate(dateString?: string): string {
    if (!dateString) return '';

    const date = new Date(dateString);

    // Verificar que la fecha sea válida
    if (isNaN(date.getTime())) {
      console.warn("⚠️ Fecha inválida:", dateString);
      return '';
    }

    const day = String(date.getUTCDate()).padStart(2, '0'); // 🔹 Usamos getUTCDate() para evitar desfases
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // 🔹 getUTCMonth() empieza desde 0
    const year = date.getUTCFullYear();

    return `${day}-${month}-${year}`;
  }


  // ✅ Método para guardar los datos
  onSave(): void {
    if (this.walletForm.valid) {
      let walletData = this.walletForm.value;


      if (walletData.discountDate instanceof Date) {
        walletData.discountDate = this.formatDate(walletData.discountDate.toISOString());
      }


      console.log('📤 Datos enviados:', walletData);
      this.dialogRef.close(walletData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

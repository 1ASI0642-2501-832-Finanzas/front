import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-wallet-dialog',
  templateUrl: './wallet-dialog.component.html',
  standalone: false,
  styleUrls: ['./wallet-dialog.component.css']
})
export class WalletDialogComponent {
  walletForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<WalletDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.walletForm = this.fb.group({
      name: [data?.name || '', Validators.required],
      description: [data?.description || '', Validators.required],
      discountDate: [data?.discountDate ? new Date(data.discountDate) : null, Validators.required]
    });
  }

  onSave(): void {
    if (this.walletForm.valid) {
      const selectedDate = this.walletForm.value.discountDate;

      const formattedDate = selectedDate ? new Date(selectedDate).toISOString() : null; // 🔹 Formato ISO 8601

      const walletData = {
        ...this.walletForm.value,
        discountDate: formattedDate
      };

      console.log('📤 Datos enviados al backend:', walletData);

      this.dialogRef.close(walletData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

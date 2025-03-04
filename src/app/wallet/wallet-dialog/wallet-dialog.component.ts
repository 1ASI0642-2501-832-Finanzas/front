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
      discountDate: [this.data?.discountDate ? new Date(this.data.discountDate) : null, Validators.required]
    });
  }

  onSave(): void {
    if (this.walletForm.valid) {
      const selectedDate = this.walletForm.value.discountDate;
      const formattedDate = selectedDate ? new Date(selectedDate).toISOString() : null;

      const walletData = {
        ...this.walletForm.value,
        discountDate: formattedDate
      };

      console.log('📤 Datos enviados:', walletData);
      this.dialogRef.close(walletData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

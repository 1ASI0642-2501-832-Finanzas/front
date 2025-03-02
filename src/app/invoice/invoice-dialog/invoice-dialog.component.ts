import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Invoice } from '../../models/invoice';
import {InvoiceService} from '../../services/invoice.service';

@Component({
  selector: 'app-invoice-dialog',
  templateUrl: './invoice-dialog.component.html',
  standalone: false,
  styleUrls: ['./invoice-dialog.component.css']
})
export class InvoiceDialogComponent implements OnInit {
  invoiceForm!: FormGroup;
  isEditMode: boolean = false;

  // Opciones de dropdowns
  invoiceTypes: string[] = ['Factura', 'Letra'];
  banks: string[] = [
    'Banco de Crédito del Perú', 'BBVA Perú', 'Scotiabank Perú', 'Interbank',
    'BanBif', 'Banco Pichincha', 'Finaktiva', 'Quipu', 'Daviplata', 'Nequi', 'Movii'
  ];
  costTypes: string[] = ['Efectivo', 'Porcentaje'];
  statuses: string[] = ['En progreso', 'Facturado'];
  reasons: string[] = ['Gestión administrativa', 'Otros gastos', 'Transporte'];

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private dialogRef: MatDialogRef<InvoiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { invoice: Invoice, isViewMode: boolean, walletId: number }
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data.invoice?.id; // Determina si es edición o creación

    this.invoiceForm = this.fb.group({
      invoiceType: [this.data.invoice?.invoiceType || '', Validators.required],
      financialInstitutionName: [this.data.invoice?.financialInstitutionName || '', Validators.required],
      number: [this.data.invoice?.number || '', Validators.required],
      series: [this.data.invoice?.series || '', Validators.required],
      issuerName: [this.data.invoice?.issuerName || '', Validators.required],
      issuerRuc: [this.data.invoice?.issuerRuc || '', Validators.required],
      currency: [this.data.invoice?.currency || 'PEN', Validators.required],
      amount: [this.data.invoice?.amount || 0, [Validators.required, Validators.min(0)]],
      igv: [this.data.invoice?.igv || 0, [Validators.required, Validators.min(0)]],
      emissionDate: [this.formatDate(this.data.invoice?.emissionDate) || '', Validators.required],
      dueDate: [this.formatDate(this.data.invoice?.dueDate) || '', Validators.required],
      discountDate: [this.formatDate(this.data.invoice?.discountDate) || '', Validators.required],
      terms: [this.data.invoice?.terms || '', Validators.required],
      nominalRate: [this.data.invoice?.nominalRate || 0, [Validators.required, Validators.min(0)]],
      effectiveRate: [this.data.invoice?.effectiveRate || 0, [Validators.required, Validators.min(0)]],

      initialCosts: this.createCostArray(
        (this.data.invoice?.initialCosts || []).map(cost => ({
          ...cost,
          value: cost.value || 0
        }))
      ),
      finalCosts: this.createCostArray(
        (this.data.invoice?.finalCosts || []).map(cost => ({
          ...cost,
          value: cost.value || 0
        }))
      ),

      status: [this.data.invoice?.status || 'En progreso', Validators.required],
      tcea: [{ value: this.data.invoice?.tcea || 0, disabled: true }], // Solo de lectura
      walletId: [this.data.walletId, Validators.required] // Se pasa el walletId
    });

    console.log("🧐 walletId recibido:", this.data.walletId);

  }

  // Método para formatear fecha en YYYY-MM-DD para el datepicker
  private formatDate(dateString?: string): string {
    return dateString ? new Date(dateString).toISOString().split('T')[0] : '';
  }

  // Método para crear un FormArray de costos (iniciales y finales)
  private createCostArray(costs: { reason: string, value: number, type: string }[]): FormArray {
    return this.fb.array(costs.map(cost => this.createCostGroup(cost)));
  }

  // Método para crear un FormGroup de un costo individual
  private createCostGroup(cost: { reason: string, value: number, type: string }): FormGroup {
    return this.fb.group({
      reason: [cost.reason || '', Validators.required],
      value: [cost.value || 0, [Validators.required, Validators.min(0)]],
      type: [cost.type || 'Fijo', Validators.required]
    });
  }

  // Obtener referencia al FormArray de initialCosts
  get initialCosts(): FormArray {
    return this.invoiceForm.get('initialCosts') as FormArray;
  }

  // Obtener referencia al FormArray de finalCosts
  get finalCosts(): FormArray {
    return this.invoiceForm.get('finalCosts') as FormArray;
  }

  // Agregar un costo inicial
  addInitialCost(): void {
    this.initialCosts.push(this.createCostGroup({ reason: '', value: 0, type: 'Fijo' }));
  }

  // Eliminar un costo inicial
  removeInitialCost(index: number): void {
    this.initialCosts.removeAt(index);
  }

  // Agregar un costo final
  addFinalCost(): void {
    this.finalCosts.push(this.createCostGroup({ reason: '', value: 0, type: 'Fijo' }));
  }

  // Eliminar un costo final
  removeFinalCost(index: number): void {
    this.finalCosts.removeAt(index);
  }

  // Cierra el diálogo sin guardar cambios
  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.invoiceForm.invalid) {
      console.warn("⚠️ Formulario inválido. Revisa los campos.");
      return;
    }

    const invoiceData = this.invoiceForm.getRawValue();
    invoiceData.tcea = null; // El backend lo calculará

    if (this.data.invoice?.id) {
      // Si existe un ID, actualizamos (PUT)
      this.invoiceService.updateInvoice(this.data.invoice.id, invoiceData).subscribe({
        next: (response) => {
          console.log("✅ Factura actualizada", response);
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error("❌ Error al actualizar la factura", error);
        }
      });
    } else {
      // Si no hay ID, creamos una nueva factura (POST)
      invoiceData.walletId = this.data.walletId; // Asegurar que se envíe el walletId

      this.invoiceService.createInvoice(invoiceData).subscribe({
        next: (response) => {
          console.log("✅ Factura creada", response);
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error("❌ Error al crear la factura", error);
        }
      });
    }
  }

}

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
  isViewMode: boolean = false;

  // Opciones de dropdowns
  invoiceTypes: string[] = ['Factura', 'Letra'];
  banks: string[] = [
    'Banco de Crédito del Perú', 'BBVA Perú', 'Scotiabank Perú', 'Interbank',
    'BanBif', 'Banco Pichincha', 'Finaktiva', 'Quipu', 'Daviplata', 'Nequi', 'Movii'
  ];
  costTypes: string[] = ['Efectivo', 'Porcentaje'];
  statuses: string[] = ['En progreso', 'Facturado'];
  rateTypes: string[] = ['Tasa Nominal', 'Tasa Efectiva'];
  initialCostReasons: string[] = [
    'Gastos administrativos',
    'Asesoría financiera',
    'Costos notariales',
    'Otros costos iniciales'
  ];
  finalCostReasons: string[] = [
    'Intereses',
    'Comisiones',
    'Costos adicionales',
    'Otros costos finales'
  ];

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private dialogRef: MatDialogRef<InvoiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { invoice: Invoice, isViewMode: boolean, walletId: number, discountDate: string }
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data.invoice?.id; // Determina si es edición o creación
    this.isViewMode = this.data.isViewMode || false;


    this.invoiceForm = this.fb.group({
      invoiceType: [this.data.invoice?.invoiceType || '', Validators.required],
      financialInstitutionName: [this.data.invoice?.financialInstitutionName || '', Validators.required],
      number: [this.data.invoice?.number || '', Validators.required],
      series: [this.data.invoice?.series || '', Validators.required],
      issuerName: [this.data.invoice?.issuerName || '', Validators.required],
      issuerRuc: [this.data.invoice?.issuerRuc || '', Validators.required],
      currency: [this.data.invoice?.currency || 'PEN', Validators.required],
      amount: [this.data.invoice?.amount || 0, [Validators.required, Validators.min(0)]],
      emissionDate: [this.parseDate(this.data.invoice?.emissionDate), Validators.required],
      dueDate: [this.parseDate(this.data.invoice?.dueDate), Validators.required],
      discountDate: [{ value: this.parseDate(this.data.discountDate), disabled: true }, Validators.required], //

      terms: [this.data.invoice?.terms || '', Validators.required],

      rateType: ['Tasa Efectiva', Validators.required],
      nominalRate: [{ value: 0, disabled: true }, [Validators.min(0)]], // Se usa solo en frontend
      capitalizationDays: [{ value: 0, disabled: true }, [Validators.min(1)]], // Solo para TN
      effectiveRate: [{ value: this.data.invoice?.effectiveRate || 0, disabled: false }, [Validators.min(0)]],
      tepDays: [this.data.invoice?.tepDays || 30, [Validators.required, Validators.min(1)]],

      initialCosts: this.createCostArray(this.data.invoice?.initialCosts || []),
      finalCosts: this.createCostArray(this.data.invoice?.finalCosts || []),


      status: [this.data.invoice?.status || 'En progreso', Validators.required],
      tcea: [{ value: this.data.invoice?.tcea || 0, disabled: true }], // Solo de lectura
      walletId: [this.data.walletId, Validators.required] // Se pasa el walletId
    });

    console.log("🧐 walletId recibido:", this.data.walletId);

    if (this.isViewMode) {
      this.invoiceForm.disable(); // Deshabilitar formulario en modo vista
    }

    // 🔹 Detectar cambios en la selección de tipo de tasa
    this.invoiceForm.get('rateType')?.valueChanges.subscribe((value) => this.handleRateSelection(value));


  }



  private handleRateSelection(rateType: string): void {
    if (rateType === 'Tasa Nominal') {
      this.invoiceForm.get('nominalRate')?.enable();
      this.invoiceForm.get('capitalizationDays')?.enable();
      this.invoiceForm.get('effectiveRate')?.disable();
      this.invoiceForm.get('effectiveRate')?.setValue(0);
    } else {
      this.invoiceForm.get('effectiveRate')?.enable();
      this.invoiceForm.get('nominalRate')?.disable();
      this.invoiceForm.get('capitalizationDays')?.disable();
      this.invoiceForm.get('nominalRate')?.setValue(0);
      this.invoiceForm.get('capitalizationDays')?.setValue(0);
    }
  }



  private convertNominalToEffective(nominalRate: number, capitalizationDays: number, tepDays: number): number {
    const nominalRateDecimal = nominalRate / 100; // Convertimos el entero a decimal
    return (Math.pow(1 + (nominalRateDecimal / capitalizationDays), tepDays) - 1) * 100;
  }




  private parseDate(dateString?: string | Date): Date | null {
    if (!dateString) return null;

    // Si ya es un objeto Date válido, lo devolvemos directamente
    if (dateString instanceof Date && !isNaN(dateString.getTime())) {
      return dateString;
    }

    // Si la fecha ya está en formato YYYY-MM-DD, la convertimos a Date
    if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return new Date(dateString);
    }

    // Si viene en formato DD-MM-YYYY, la convertimos correctamente
    if (typeof dateString === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
      const [day, month, year] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day); // ⚠️ Restamos 1 al mes porque en JS los meses van de 0 a 11
    }

    return null;
  }



  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }



  private createCostArray(costs: { reason: string, value: number }[]): FormArray {
    return this.fb.array(costs.map(cost => this.createCostGroup(cost)));
  }

  private createCostGroup(cost: { reason: string, value: number }): FormGroup {
    return this.fb.group({
      reason: [cost.reason || '', Validators.required],
      value: [cost.value || 0, [Validators.required, Validators.min(0)]]
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
    this.initialCosts.push(this.createCostGroup({ reason: '', value: 0 }));
  }

  // Eliminar un costo inicial
  removeInitialCost(index: number): void {
    this.initialCosts.removeAt(index);
  }

  // Agregar un costo final
  addFinalCost(): void {
    this.finalCosts.push(this.createCostGroup({ reason: '', value: 0}));
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
      console.warn('⚠️ Formulario inválido:', this.invoiceForm.value);
      return;
    }

    let invoiceData = this.invoiceForm.getRawValue();

    if (invoiceData.rateType === 'Tasa Nominal') {
      invoiceData.effectiveRate = this.convertNominalToEffective(
        invoiceData.nominalRate,
        invoiceData.capitalizationDays,
        invoiceData.tepDays
      );
    }

    delete invoiceData.nominalRate;
    delete invoiceData.rateType;
    delete invoiceData.capitalizationDays;
    delete invoiceData.tcea;

    // 🔹 Convertimos Date a string "DD-MM-YYYY" antes de enviarlo al backend
    invoiceData.emissionDate = this.formatDate(invoiceData.emissionDate);
    invoiceData.dueDate = this.formatDate(invoiceData.dueDate);
    invoiceData.discountDate = this.formatDate(invoiceData.discountDate);

    console.log("📤 Enviando datos:", JSON.stringify(invoiceData, null, 2));

    (this.data.invoice?.id
      ? this.invoiceService.updateInvoice(this.data.invoice.id, invoiceData)
      : this.invoiceService.createInvoice(invoiceData))
      .subscribe(response => {
        console.log('✅ Operación exitosa:', response);
        this.dialogRef.close(true);
      }, error => console.error('❌ Error en operación:', error));
  }


}

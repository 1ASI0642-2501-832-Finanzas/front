import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { DashboardModule } from './dashboard/dashboard.module';

import {
  ButtonDirective,
  ContainerComponent,
  DropdownComponent, DropdownItemDirective, DropdownMenuDirective,
  DropdownToggleDirective,
  FooterModule,
  HeaderModule,
  NavItemComponent, NavLinkDirective
} from '@coreui/angular';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import {WalletComponent} from './wallet/wallet.component';
import {WalletDialogComponent} from './wallet/wallet-dialog/wallet-dialog.component';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from '@angular/material/datepicker';
import {MatFormField, MatInput, MatInputModule, MatSuffix} from '@angular/material/input';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatDialogActions, MatDialogContent, MatDialogModule, MatDialogTitle} from '@angular/material/dialog';
import {MatCard, MatCardTitle} from '@angular/material/card';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatIcon} from '@angular/material/icon';
import {MAT_DATE_LOCALE, MatNativeDateModule, MatOption} from '@angular/material/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { InvoiceDialogComponent } from './invoice/invoice-dialog/invoice-dialog.component';
import {MatSelect} from '@angular/material/select';
import {MatAccordion, MatExpansionPanel, MatExpansionPanelTitle} from '@angular/material/expansion';
import {MatTooltip} from '@angular/material/tooltip';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    PageNotFoundComponent,
    WalletComponent,
    WalletDialogComponent,
    HomeComponent,
    InvoiceComponent,
    InvoiceDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    DashboardModule,
    FooterModule,
    HeaderModule,
    CommonModule,
    ReactiveFormsModule,
    NavItemComponent,
    DropdownComponent,
    ContainerComponent,
    DropdownToggleDirective,
    NavLinkDirective,
    DropdownMenuDirective,
    DropdownItemDirective,
    ButtonDirective,
    MatDatepickerInput,
    MatInput,
    MatSuffix,
    MatFormField,
    MatDatepickerToggle,
    MatDatepicker,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatCard,
    MatTable,
    MatHeaderCell,
    MatCell,
    MatColumnDef,
    MatHeaderCellDef,
    MatCellDef,
    MatIconButton,
    MatIcon,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatDialogModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatInputModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatSelect,
    MatOption,
    MatCardTitle,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatAccordion,
    MatTooltip
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB'}
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './auth/auth-interceptor.service';

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
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from '@angular/material/datepicker';
import {MatFormField, MatInput, MatInputModule, MatSuffix} from '@angular/material/input';
import {MatButton, MatButtonModule, MatIconButton} from '@angular/material/button';
import {MatDialogActions, MatDialogContent, MatDialogModule, MatDialogTitle} from '@angular/material/dialog';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable, MatTableModule
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
import {DashboardComponent} from './dashboard/dashboard.component';
import {MatList, MatListItem} from '@angular/material/list';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {BaseChartDirective} from 'ng2-charts';

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
    InvoiceDialogComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
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
    MatTooltip,
    MatListItem,
    MatList,
    FormsModule,
    MatCardContent,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatGridList,
    MatGridTile,
    MatCardHeader,
    BaseChartDirective
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

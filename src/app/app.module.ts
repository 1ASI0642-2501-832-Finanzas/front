import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { DashboardModule } from './dashboard/dashboard.module';

import {
  ButtonDirective,
  ContainerComponent,
  DropdownComponent, DropdownDividerDirective, DropdownItemDirective, DropdownMenuDirective, DropdownToggleDirective,
  FooterModule,
  HeaderModule,
  NavItemComponent,
  NavLinkDirective
} from '@coreui/angular';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HomeComponent } from './components/home/home.component';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    PageNotFoundComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    DashboardModule,
    FooterModule,
    HeaderModule,
    ContainerComponent,
    NavItemComponent,
    NavLinkDirective,
    DropdownComponent,
    DropdownDividerDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    DropdownItemDirective,
    ButtonDirective,
    MatIcon,
    MatButton
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

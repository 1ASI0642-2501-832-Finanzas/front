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


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
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
    ButtonDirective
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

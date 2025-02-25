import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';

import {HttpClientModule, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import {HTTP_INTERCEPTORS} from '@angular/common/http';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { DashboardModule } from './dashboard/dashboard.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    DashboardModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import {MatToolbar} from "@angular/material/toolbar";
import {MatButton} from '@angular/material/button';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatToolbar,
    MatButton
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule { }

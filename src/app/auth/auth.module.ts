import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {MatFormField} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {MatCheckbox} from '@angular/material/checkbox';
import { RegisterComponent } from './register/register.component';
import {ButtonDirective, FormCheckComponent} from '@coreui/angular';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCard,
    MatCardTitle,
    MatFormField,
    MatInputModule,
    MatButtonModule,
    MatCardActions,
    MatCardContent,
    MatCardSubtitle,
    MatCardHeader,
    MatCheckbox,
    FormCheckComponent,
    ButtonDirective
  ],
  exports: [
    LoginComponent
  ]
})
export class AuthModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { MaterialModule } from '../material/material.module';
import { LayouPageComponent } from './pages/layou-page/layou-page.component';
import { AuthRoutingModule } from './auth.routing';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [LoginPageComponent, LayouPageComponent],
  imports: [CommonModule, MaterialModule, AuthRoutingModule, ReactiveFormsModule],

})

export class AuthModule {}

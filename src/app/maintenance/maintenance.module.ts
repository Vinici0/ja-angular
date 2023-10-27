import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { ExtentPageComponent } from './pages/extent-page/extent-page.component';
import { MaterialModule } from '../material/material.module';
import { MaintenaceRoutingModule } from './maintenace-routing.module';
import { TableExtentPageComponent } from './pages/table-extent-page/table-extent-page.component';
import { InterestPageComponent } from './pages/interest-page/interest-page.component';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyPageComponent } from './pages/company-page/company-page.component';
@NgModule({
  declarations: [
    LayoutPageComponent,
    ProfilePageComponent,
    ExtentPageComponent,
    TableExtentPageComponent,
    InterestPageComponent,
    CompanyPageComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MaintenaceRoutingModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [MaintenaceRoutingModule],
})
export class MaintenanceModule {}

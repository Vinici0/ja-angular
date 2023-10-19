import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { RouterModule } from '@angular/router';
import { ServiceReportComponent } from './pages/service-report/service-report.component';
import { ServiceExpenseComponent } from './pages/service-expense/service-expense.component';
import { QrgeneratorRoutingModule } from './qrgenerator-routing.module';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { UsuarioPageComponent } from './pages/usuario-page/usuario-page.component';
import { AddExtentComponent } from './pages/add-extent/add-extent.component';
import { DialogUsuarioComponent } from './modals/dialog-usuario/dialog-usuario.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { PdfViewComponent } from './modals/pdf-view/pdf-view.component';
import { MeterPageComponent } from './pages/meter-page/meter-page.component';
import { CutomersPageComponent } from './pages/cutomers-page/cutomers-page.component';
import { DialogClienteComponent } from './modals/dialog-cliente/dialog-cliente.component';

@NgModule({
  declarations: [
    LayoutPageComponent,
    ServiceReportComponent,
    ServiceExpenseComponent,
    UsuarioPageComponent,
    AddExtentComponent,
    DialogUsuarioComponent,
    DashboardComponent,
    PdfViewComponent,
    MeterPageComponent,
    CutomersPageComponent,
    DialogClienteComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    QrgeneratorRoutingModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    NgxExtendedPdfViewerModule,
  ],
  exports: [QrgeneratorRoutingModule],
})
export class JuntadeanguaModule {}

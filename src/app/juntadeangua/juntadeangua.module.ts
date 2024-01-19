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
import { DashboardComponent } from './pages/dashboard-page/dashboard.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { PdfViewComponent } from './modals/pdf-view/pdf-view.component';
import { MeterPageComponent } from './pages/meter-page/meter-page.component';
import { CutomersPageComponent } from './pages/cutomers-page/cutomers-page.component';
import { DialogClienteComponent } from './modals/dialog-cliente/dialog-cliente.component';
import { FinePageComponent } from './pages/fine-page/fine-page.component';
import { FineaddPageComponent } from './pages/fineadd-page/fineadd-page.component';
import { SearchClientComponent } from './modals/search-client/search-client.component';
import { RegisterFinePageComponent } from './pages/register-fine-page/register-fine.component';
import { DialogAddFineComponent } from './modals/dialog-add-fine/dialog-add-fine.component';
import { FineeditPageComponent } from './pages/fineedit-page/fineedit-page.component';
import { AddCustomerComponent } from './components/add-customer/add-customer.component';
import { AddMeasureComponent } from './components/add-measure/add-measure.component';
import { TablefineViewComponent } from './modals/tablefine-view/tablefine-view.component';
import { CustomerViewComponent } from './modals/customer-view/customer-view.component';
import { EditMeasureComponent } from './components/edit-measure/edit-measure.component';
import { NewPasswordComponent } from './modals/new-password/new-password.component';
import { CalculateTotalAmountComponent } from './components/calculate-total-amount/calculate-total-amount.component';
import { ClientsComponent } from './pages/dashboard-page/clients/clients.component';
import { MeterComponent } from './pages/dashboard-page/meter/meter.component';
import { UsersComponent } from './pages/dashboard-page/users/users.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MeditionsComponent } from './pages/dashboard-page/meditions/meditions.component';
import { ListAbonosComponent } from './components/list-abonos/list-abonos.component';


@NgModule({
  declarations: [
    LayoutPageComponent,
    ServiceReportComponent,
    ServiceExpenseComponent,
    UsuarioPageComponent,
    AddExtentComponent,
    DialogUsuarioComponent,
    DialogAddFineComponent,
    DashboardComponent,
    PdfViewComponent,
    MeterPageComponent,
    CutomersPageComponent,
    DialogClienteComponent,
    FinePageComponent,
    FineaddPageComponent,
    SearchClientComponent,
    RegisterFinePageComponent,
    FineeditPageComponent,
    AddCustomerComponent,
    AddMeasureComponent,
    TablefineViewComponent,
    CustomerViewComponent,
    EditMeasureComponent,
    NewPasswordComponent,
    CalculateTotalAmountComponent,
    ClientsComponent,
    MeterComponent,
    UsersComponent,
    MeditionsComponent,
    ListAbonosComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    QrgeneratorRoutingModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    NgxExtendedPdfViewerModule,
    NgxChartsModule,
  ],
  exports: [QrgeneratorRoutingModule],
})
export class JuntadeanguaModule {}

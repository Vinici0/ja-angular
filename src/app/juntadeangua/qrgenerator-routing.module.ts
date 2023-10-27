import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ServiceExpenseComponent } from './pages/service-expense/service-expense.component';
import { UsuarioPageComponent } from './pages/usuario-page/usuario-page.component';
import { ServiceReportComponent } from './pages/service-report/service-report.component';
import { AddExtentComponent } from './pages/add-extent/add-extent.component';
import { DashboardComponent } from './pages/dashboard-page/dashboard.component';
import { MeterPageComponent } from './pages/meter-page/meter-page.component';
import { CutomersPageComponent } from './pages/cutomers-page/cutomers-page.component';
import { FinePageComponent } from './pages/fine-page/fine-page.component';
import { FineaddPageComponent } from './pages/fineadd-page/fineadd-page.component';
import { RegisterFinePageComponent } from './pages/register-fine-page/register-fine.component';
import { FineeditPageComponent } from './pages/fineedit-page/fineedit-page.component';
import {AddCustomerComponent} from './components/add-customer/add-customer.component';
import {AddMeasureComponent} from './components/add-measure/add-measure.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      {
        path: 'pages/all',
        component: ServiceExpenseComponent,
      },
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'pages/dashboard',
        component: DashboardComponent,
      },
      {
        path: 'pages/usuario',
        component: UsuarioPageComponent,
      },
      {
        path: 'pages/service-expense',
        component: ServiceExpenseComponent,
      },
      {
        path: 'pages/add-extent',
        component: AddExtentComponent,
      },
      {
        path: 'pages/meter',
        component: MeterPageComponent,
      },
      {
        path: 'pages/cutomers',
        component: CutomersPageComponent,
      },
      {
        path: 'pages/fine',
        component: FinePageComponent,
      },
      {
        path: 'pages/addfine',
        component: FineaddPageComponent,
      },
      {
        path: 'pages/register-fine',
        component: RegisterFinePageComponent,
      },
      {
        path: 'pages/fineedit/:id',
        component: FineeditPageComponent,
      },
      {
        path: 'pages/add-customer',
        component: AddCustomerComponent,
      },
      {
        path: 'pages/add-measure',
        component: AddMeasureComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrgeneratorRoutingModule {}

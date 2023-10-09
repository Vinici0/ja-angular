import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ServiceExpenseComponent } from './pages/service-expense/service-expense.component';
import { UsuarioPageComponent } from './pages/usuario-page/usuario-page.component';
import { ServiceReportComponent } from './pages/service-report/service-report.component';
import { AddExtentComponent } from './pages/add-extent/add-extent.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MeterPageComponent } from './pages/meter-page/meter-page.component';
import { CutomersPageComponent } from './pages/cutomers-page/cutomers-page.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      {
        path: 'pages/all',
        component: ServiceExpenseComponent,
      },
      //dashboard
      {
        path: 'pages/dashboard',
        component: DashboardComponent,
      },
      {
        path: 'pages/usuario',
        component: UsuarioPageComponent
      },
      {
        path: 'pages/service-expense',
        component: ServiceExpenseComponent
      },
      {
        path: 'pages/add-extent',
        component: AddExtentComponent
      },
      {
        path: 'pages/meter',
        component: MeterPageComponent
      },{
        path: 'pages/cutomers',
        component: CutomersPageComponent
      }
    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrgeneratorRoutingModule {}

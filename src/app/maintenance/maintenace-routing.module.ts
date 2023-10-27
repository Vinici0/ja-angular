import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { TableExtentPageComponent } from './pages/table-extent-page/table-extent-page.component';
import { InterestPageComponent } from './pages/interest-page/interest-page.component';
import { ExtentPageComponent } from './pages/extent-page/extent-page.component';
import { CompanyPageComponent } from './pages/company-page/company-page.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      {
        path: '',
        component: CompanyPageComponent,
      },
      {
        path: 'pages/profile',
        component: ProfilePageComponent,
      },
      {
        path: 'pages/table-extent',
        component: TableExtentPageComponent,
      },
      {
        path: 'pages/interest',
        component: InterestPageComponent,
      },
      {
        path: 'pages/extent',
        component: ExtentPageComponent,
      },
      {
        path: 'pages/company',
        component: CompanyPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenaceRoutingModule {}

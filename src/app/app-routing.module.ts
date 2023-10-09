import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './juntadeangua/pages/layout-page/layout-page.component';

const routes: Routes = [
  {
    path: 'junta-de-angua',
    loadChildren: () => import('./juntadeangua/juntadeangua.module').then( m => m.JuntadeanguaModule ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

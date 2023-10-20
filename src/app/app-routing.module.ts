import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { PublicGuard } from './auth/guards/justa-agua.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    canActivate: [PublicGuard],
    canMatch: [PublicGuard],
  },
  {
    path: 'junta-de-angua',
    loadChildren: () =>
      import('./juntadeangua/juntadeangua.module').then(
        (m) => m.JuntadeanguaModule
      ),
    canActivate: [AuthGuard],
    canMatch: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

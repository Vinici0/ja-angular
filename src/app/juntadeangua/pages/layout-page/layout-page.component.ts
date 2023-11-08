import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Router } from '@angular/router';
import { Company } from 'src/app/auth/models/company.model';
import { Usuario } from 'src/app/auth/models/usuario.model';
import { NewPasswordComponent } from '../../modals/new-password/new-password.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrls: ['./layout-page.component.css'],
})
export class LayoutPageComponent {
  public company: Company;
  public usuario: Usuario;
  constructor(
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    this.company = authService.company;
    this.usuario = authService.usuario;
  }

  logout() {
    this.authService.logout();
  }

  remplaceLink(link: string) {
    console.log(link);
    this.router.navigateByUrl('/maintenance/pages/' + link);
  }

  editarUsuario() {
    this.dialog
      .open(NewPasswordComponent, {
        disableClose: true,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'agregado') {
          // this.mostrarUsuarios();
        }
      });
  }
}

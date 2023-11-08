import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Company } from 'src/app/auth/models/company.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { NewPasswordComponent } from 'src/app/juntadeangua/modals/new-password/new-password.component';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrls: ['./layout-page.component.css'],
})
export class LayoutPageComponent {
  public company: Company;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.company = authService.company;
  }

  logout = () => {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/auth');
  };

  remplaceLink(link: string) {
    console.log(link);
    this.router.navigateByUrl('/junta-de-angua/pages/' + link);
  }

  editarUsuario() {
    this.dialog
      .open(NewPasswordComponent, {
        disableClose: true,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'agregado') {
        }
      });
  }
}

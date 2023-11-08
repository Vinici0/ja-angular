import {
  Component,
  Inject,
  OnInit,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/users.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Usuario } from 'src/app/auth/models/usuario.model';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css'],
})
export class NewPasswordComponent {
  public formUsuario: FormGroup;
  public hide: boolean = true;
  public accion: string = 'Agregar';
  public accionBoton: string = 'Guardar';
  public listaRoles: any[] = [];
  public isPasswordVisible: boolean = false;
  public usuario: Usuario;

  constructor(
    @Inject(MAT_DIALOG_DATA) public usuarioEditar: any,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private userService: UserService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<NewPasswordComponent>
  ) {
    this.formUsuario = this.fb.group({
      newName: ['', Validators.required],
      newEmail: ['', Validators.required],
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.usuario = authService.usuario;
  }

  ngOnInit(): void {
    this.formUsuario.patchValue({
      newName: this.usuario.nombre,
      newEmail: this.usuario.email,
      oldPassword: '',
    });
  }

  ngAfterViewInit() {}

  mostrarAlerta(mensaje: string, tipo: string) {
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 3000,
    });
  }

  updateUserInfo() {
    console.log(this.formUsuario.value);

    if (this.formUsuario.invalid) {
      // alerta de completar campos
      this.mostrarAlerta('Complete los campos', 'error');
      return;
    }
    const usuario = this.formUsuario.value;
    this.userService
      .updateUserInfo(this.usuario.idJaUsuario, usuario)
      .subscribe(
        (resp) => {
          console.log(resp);
          this.mostrarAlerta('Se ha actualizado correctamente', 'success');
          this.dialogRef.close('agregado');
          // Actualizar el objeto usuario
          this.authService.usuario.nombre = usuario.newName;
          this.authService.usuario.email = usuario.newEmail;

        },
        (err) => {
          console.log(err);
          this.mostrarAlerta('Error al actualizar', 'error');
        }
      );
  }
}

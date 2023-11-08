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
      nombre: ['', Validators.required],
      email: ['', Validators.required],
      role: ['', Validators.required],
      password: ['', Validators.required],
    });

    if (this.usuarioEditar) {
      this.accion = 'Editar';
      this.accionBoton = 'Actualizar';
    }
  }

  ngOnInit(): void {
    console.log('console.log(this.usuarioEditar)');

    console.log(this.usuarioEditar);

    if (this.usuarioEditar) {
      this.formUsuario.patchValue({
        nombre: this.usuarioEditar.nombre,
        email: this.usuarioEditar.email,
        role: this.usuarioEditar.role,
        password: this.usuarioEditar.password,
      });
    }
  }

  ngAfterViewInit() {}

  agregarEditarUsuario() {
    if (this.usuarioEditar) {
      const usuarioEditado: any = {
        idJaUsuario: this.usuarioEditar.idJaUsuario,
        nombre: this.formUsuario.get('nombre')?.value,
        email: this.formUsuario.get('email')?.value,
        role: this.formUsuario.get('role')?.value,
        password: this.formUsuario.get('password')?.value,
        img: this.usuarioEditar.img,
      };


      this.userService
        .actualizarUsuario(this.usuarioEditar.idJaUsuario, usuarioEditado)
        .subscribe((resp) => {
          if (resp) {
            this.mostrarAlerta('Usuario actualizado correctamente', 'success');
            this.dialogRef.close('actualizado');
          }
        });
    } else {
      const nuevoUsuario: any = {
        nombre: this.formUsuario.get('nombre')?.value,
        email: this.formUsuario.get('email')?.value,
        role: this.formUsuario.get('role')?.value,
        password: this.formUsuario.get('password')?.value,
      };

      this.userService.createUser(nuevoUsuario).subscribe((resp) => {
        if (resp) {
          this.mostrarAlerta('Usuario creado correctamente', 'success');
          this.dialogRef.close('agregado');
        }
      });
    }
  }

  mostrarAlerta(mensaje: string, tipo: string) {
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 3000,
    });
  }
}

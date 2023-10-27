import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FineService } from '../../services/fines.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-add-fine',
  templateUrl: './dialog-add-fine.component.html',
  styleUrls: ['./dialog-add-fine.component.css'],
})
export class DialogAddFineComponent implements OnInit {
  formUsuario: FormGroup;
  hide: boolean = true;
  accion: string = 'Agregar';
  accionBoton: string = 'Guardar';
  listaRoles: any[] = [];

  public myForm: FormGroup = this.fb.group({
    typeFine: ['', [Validators.required]],
    cost: ['', [Validators.required]],
  });

  constructor(
    private fineService: FineService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DialogAddFineComponent>
  ) {
    if (this.data && this.data.accion) {
      this.accion = this.data.accion;
      this.accionBoton = this.accion === 'Agregar' ? 'Guardar' : 'Actualizar';
    }
  }

  ngOnInit(): void {
    if (this.data && this.data.fine) {
      const { typeFine, cost } = this.data.fine;
      this.myForm.setValue({
        typeFine: typeFine,
        cost: cost,
      });
    }
  }

  ngAfterViewInit() {}

  agregarEditarUsuario() {
    console.log(this.myForm.value);
  }

  mostrarAlerta(mensaje: string, tipo: string) {
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 3000,
    });
  }

  onSaveUpdate() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    this.myForm.value.typeFine = this.myForm.value.typeFine.toUpperCase();
    if (this.accion === 'Agregar') {
      this.fineService.createFine(this.myForm.value).subscribe((resp) => {
        console.log(resp);
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          width: 450,
          timer: 2000,
          title: 'Se ha agregado correctamente',
          icon: 'success',
        });

        this.dialogRef.close(true);
      });
    } else if (this.accion === 'Actualizar') {
      this.fineService
        .updateFine(this.data.fine.idMulta, this.myForm.value)

        .subscribe((resp) => {
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            width: 450,
            timer: 2000,
            title: 'Se ha actualizado correctamente',
            icon: 'success',
          });

          this.dialogRef.close(true);
        });
    }
  }
}

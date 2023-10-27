import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigService } from '../../services/config.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Company } from 'src/app/auth/models/company.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-company-page',
  templateUrl: './company-page.component.html',
  styleUrls: ['./company-page.component.css'],
})
export class CompanyPageComponent implements OnInit {
  public imagenSubir: File;
  public imgTemp: any = '';
  public company: Company;

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private fb: FormBuilder
  ) {
    this.company = authService.company;
  }

  ngOnInit(): void {
    this.myForm.controls['nombreEmpresa'].setValue(this.company.nombreEmpresa);
    this.myForm.controls['rucEmpresa'].setValue(this.company.rucEmpresa);
    this.myForm.controls['direccionEmpresa'].setValue(
      this.company.direccionEmpresa
    );
    this.myForm.controls['telefonoEmpresa'].setValue(
      this.company.telefonoEmpresa
    );
    this.myForm.controls['emailEmpresa'].setValue(this.company.emailEmpresa);
    this.myForm.controls['mensajeEmpresa'].setValue(
      this.company.mensajeEmpresa
    );
  }

  public myForm: FormGroup = this.fb.group({
    nombreEmpresa: ['', [Validators.required]],
    rucEmpresa: ['', [Validators.required]],
    direccionEmpresa: ['', [Validators.required]],
    telefonoEmpresa: ['', [Validators.required]],
    emailEmpresa: ['', [Validators.required]],
    mensajeEmpresa: ['', [Validators.required]],
  });

  updateTableExtents() {}

  updateEmpresa() {
    const {
      nombreEmpresa,
      rucEmpresa,
      direccionEmpresa,
      telefonoEmpresa,
      emailEmpresa,
      mensajeEmpresa,
    } = this.myForm.value;

    const data = {
      nombreEmpresa,
      rucEmpresa,
      direccionEmpresa,
      telefonoEmpresa,
      emailEmpresa,
      mensajeEmpresa,
      img: this.company.img,
    };

    Swal.fire({
      title: '¿Desea actualizar los datos?',
      showCancelButton: true,
      confirmButtonText: `Actualizar`,
      cancelButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateCompany(data);
        Swal.fire('Actualizado!', '', 'success');
      }
    });
  }

  updateCompany(data: any) {
    if (this.company.idEmpresa === undefined) return;

    this.configService
      .updateEmpresa(this.company.idEmpresa, data)
      .subscribe((res) => {
        console.log(res);

        this.company.nombreEmpresa = this.myForm.value.nombreEmpresa;
        console.log(res);
      });
  }

  cambiarImagen(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    this.imagenSubir = files[0];
    if (!files) {
      return (this.imgTemp = '');
    }
    const reader = new FileReader();
    const url64 = reader.readAsDataURL(this.imagenSubir);
    reader.onloadend = () => {
      this.imgTemp = reader.result as string;
    };
    console.log(this.imgTemp);

    return this.imgTemp;
  }

  subirImagen() {
    if (this.company.idEmpresa === undefined) return;

    this.configService
      .actualizarFoto(
        this.imagenSubir,
        'company',
        this.company.idEmpresa as string
      )
      .then(
        (img) => {
          this.company.img = img.img;
          Swal.fire('Guardado', 'Imagen de usuario actualizada', 'success');
        },
        (err) => {
          console.log(err);
          Swal.fire('Error', 'No se pudo subir la imagen', 'error');
        }
      );
  }


}

import { environment } from 'src/app/environments/environmen';
const base_url = environment.base_url;

export class Company {
  constructor(
    public nombreEmpresa: string,
    public rucEmpresa: string,
    public direccionEmpresa: string,
    public telefonoEmpresa: string,
    public emailEmpresa: string,
    public mensajeEmpresa: string,
    public img?: string,
    public idEmpresa?: string
  ) {}

  // get imagenUrl() {
  //   if (this.img?.includes('https')) {
  //     return this.img;
  //   } else if (this.img) {
  //     console.log(`${base_url}/uploads/company/${this.idEmpresa}`);
  //     return `${base_url}/uploads/company/${this.idEmpresa}`;
  //   } else {
  //     console.log(`${base_url}/uploads/company/no-image`);
  //     return `${base_url}/uploads/company/no-image`;
  //   }
  // }
}

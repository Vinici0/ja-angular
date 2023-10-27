import { environment } from 'src/app/environments/environmen';

const base_url = environment.base_url;

export class Usuario {
  constructor(
    public nombre: string,
    public email: string,
    public password: string,
    public role: string,
    public fecha_creacion: Date,
    public fecha_modificacion: Date,
    public fecha_ingreso: Date,
    public img?: string,
    public idJaUsuario?: number
  ) {}

  get imagenUrl() {
    if (this.img?.includes('https')) {
      return this.img;
    } else if (this.img) {
      console.log(`${base_url}/uploads/user/${this.idJaUsuario}`);

      return `${base_url}/uploads/user/${this.idJaUsuario}`;
    } else {
      return `${base_url}/uploads/user/no-image`;
    }
  }


}

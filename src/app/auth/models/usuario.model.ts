import { environment } from 'src/app/environments/environmen';

const base_url = environment.base_url;

export class Usuario {
  constructor(
    public nombre: string,
    public email: string,
    public password?: string,
    public role?: string,
    public img?: string,
    public idJaUsuario?: string
  ) {}

  get imagenUrl() {
    if (this.img?.includes('https')) {
      return this.img;
    } else if (this.img) {
      return `${base_url}/uploads/${this.img}`;
    } else {
      return `${base_url}/uploads/no-image`;
    }
  }
}

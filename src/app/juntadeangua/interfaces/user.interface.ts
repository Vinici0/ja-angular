import { Usuario } from "../models/usuario.model";

export interface UsuarioReponse {
  ok:   boolean;
  msg:  string;
  data: Data;
}

export interface Data {
  usuarios: Usuario[];
}


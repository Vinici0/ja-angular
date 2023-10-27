export interface ComapnyReponse {
  ok: boolean;
  msg: string;
  data: Data;
}

export interface Data {
  empresa: Empresa[];
}

export interface Empresa {
  idEmpresa: number;
  nombreEmpresa: string;
  rucEmpresa: string;
  direccionEmpresa: string;
  telefonoEmpresa: string;
  emailEmpresa: string;
  img: null;
  mensajeEmpresa: string;
}

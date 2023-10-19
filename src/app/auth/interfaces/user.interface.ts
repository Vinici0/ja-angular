export interface LoginResponse {
  ok:    boolean;
  msg:   string;
  data:  User;
  token: string;
}

export interface User {
  idJaUsuario:        number;
  nombre:             string;
  email:              string;
  password:           string;
  img:                null;
  role:               string;
  fecha_creacion:     Date;
  fecha_modificacion: Date;
  fecha_ingreso:      Date;
}

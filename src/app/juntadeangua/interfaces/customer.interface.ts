export interface ClienteReponse {
  ok:   boolean;
  msg:  string;
  data: Data;
}

export interface Data {
  clients: Client[];
  total:   number;
}

export interface Client {
  idCliente:            number;
  Nombre:               string;
  Ruc:                  string;
  Telefono:             null | string;
  Email:                null | string;
  Direccion:            null | string;
  FechaNacimiento:      number;
  EstadoContribuyente:  null | string;
  ObligadoContabilidad: boolean | null;
  Observacion:          null;
  FechaIngreso:         Date;
}

export interface TableExtendsReponse {
  ok:   boolean;
  msg:  string;
  data: Data;
}

export interface Data {
  tabla: Tabla[];
}

export interface Tabla {
  idTabla:  number;
  Desde:    number;
  Hasta:    number;
  Basico:   number;
  ValorExc: number;
}

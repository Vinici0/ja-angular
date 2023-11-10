export interface FinesDetailsReponse {
  ok:   boolean;
  msg:  string;
  data: Data;
}

export interface Data {
  fineDetails: FineDetail[];
}

export interface FineDetail {
  id_cliente:     number;
  date_fine:      Date;
  descripcion?:    string;
  pagado:         boolean;
  valor_pagar:    number;
  idMultaDetalle: number;
  nombre:         string;
  ruc:            string;
  telefono?:       string;
  typeFine:       string;
}

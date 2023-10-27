export interface MeasureReponse {
  ok:   boolean;
  msg:  string;
  data: Data;
}

export interface Data {
  measure: Measure[];
  total:   number;
}

export interface Measure {
  Anio:            number;
  Mes:             number;
  Nombre:          string;
  Codigo:          string;
  Manzana:         string;
  Lote:            string;
  LecturaAnterior: number;
  LecturaActual:   number;
  Basico:          number;
  Pago:            number;
  Saldo:           number;
  Consumo:         null;
  Excedente:       number;
  ExcedenteV:      number;
  Total:           number;
  Acumulado:       number;
  Planilla:        number | null;
}

export interface AnioAndMes {
  Anio:            number;
  Mes:             number;
}

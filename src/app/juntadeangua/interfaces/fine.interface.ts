export interface FineReponse {
  ok:   boolean;
  msg:  string;
  data: Data;
}

export interface Data {
  fines: Fine[];
  total: number;
}

export interface Fine {
  idMulta:  number;
  typeFine: string;
  cost:     number;
}

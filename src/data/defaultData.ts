export interface Product {
  nome: string;
  qtd: number;
  valor: number;
}

export interface CategoryItem {
  key: string;
  label: string;
  valor: number;
}

export interface QuantityItem {
  key: string;
  label: string;
  qtd: number;
}

export interface DashboardData {
  produtos: Product[];
  total: { qtd: number; valor: number };
  financeiro: { faturado: number; cancelado: number };
  itens: { finalizados: number; cancelados: number };
  prazo: { noPrazo: number; atrasados: number };
  propostas: { com: number; sem: number };
  conversao: { entrouSem: number; virouPedido: number; naoVirou: number };
  fat2025: (number | null)[];
  fat2026: (number | null)[];
  meta: number | null;
  devMes: (number | null)[];
  devMes2026: (number | null)[];
  kpiC: {
    cat: CategoryItem[];
    cc: CategoryItem[];
    qtd: QuantityItem[];
    prevV: number;
    real: (number | null)[];
    prevVProd: number;
    realProd: (number | null)[];
  };
  kpiF: {
    tot: { venda: number; compr: number; rep: number; nao: number };
    devPrev: (number | null)[];
    devReal: (number | null)[];
    prPrev: (number | null)[];
    prReal: (number | null)[];
  };
}

export const DEFAULT_DATA: DashboardData = {
  produtos: [
    { nome: "BOBINA", qtd: 9, valor: 31134.0 },
    { nome: "ETIQUETA", qtd: 29, valor: 23445.0 },
    { nome: "RÓTULO", qtd: 2, valor: 15000.2 },
  ],
  total: { qtd: 40, valor: 78579.2 },
  financeiro: { faturado: 78144.5, cancelado: 437.7 },
  itens: { finalizados: 27, cancelados: 13 },
  prazo: { noPrazo: 22, atrasados: 5 },
  propostas: { com: 6, sem: 34 },
  conversao: { entrouSem: 34, virouPedido: 22, naoVirou: 12 },
  fat2025: [
    null, null, 57218.31, 107826.7, 156192.11, 102083.74,
    115014.82, 162736.6, 254443.1, 101276.86, 104766.52, 40545.76,
  ],
  meta: null,
  fat2026: [78144.5, null, null, null, null, null, null, null, null, null, null, null],
  devMes: [null, null, 19, 40, 45, 53, 65, 46, 96, 44, 25, 25],
  devMes2026: [40, null, null, null, null, null, null, null, null, null, null, null],
  kpiC: {
    cat: [
      { key: "des", label: "DESENVOLVIMENTO", valor: 5074.44 },
      { key: "rep", label: "REPOSIÇÃO", valor: 4838.11 },
      { key: "tot", label: "TOTAL", valor: 9912.55 },
    ],
    cc: [
      { key: "psr", label: "PSR", valor: 8342.61 },
      { key: "cli", label: "CLIENTE", valor: 1569.94 },
    ],
    qtd: [
      { key: "des", label: "COMPRAS DESENVOLVIMENTO", qtd: 11 },
      { key: "rep", label: "COMPRAS REPOSIÇÃO", qtd: 11 },
    ],
    prevV: 13500,
    real: [
      4677.98, null, null, null, null, null,
      null, null, null, null, null, null,
    ],
    prevVProd: 4500,
    realProd: [
      3779.09, null, null, null, null, null,
      null, null, null, null, null, null,
    ],
  },
  kpiF: {
    tot: { venda: 3555.0, compr: 1682.58, rep: 1682.58, nao: 0 },
    devPrev: [5000, null, null, null, null, null, null, null, null, null, null, null],
    devReal: [932.58, null, null, null, null, null, null, null, null, null, null, null],
    prPrev: [9000, null, null, null, null, null, null, null, null, null, null, null],
    prReal: [4588.85, null, null, null, null, null, null, null, null, null, null, null],
  },
};

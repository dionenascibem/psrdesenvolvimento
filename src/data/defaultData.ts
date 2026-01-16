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
  meta: number | null;
  devMes: (number | null)[];
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
    { nome: "BOBINA", qtd: 100, valor: 553190.34 },
    { nome: "ETIQUETA", qtd: 263, valor: 556965.98 },
    { nome: "RÓTULO", qtd: 95, valor: 181035.2 },
  ],
  total: { qtd: 458, valor: 1291191.52 },
  financeiro: { faturado: 1202104.52, cancelado: 89087 },
  itens: { finalizados: 359, cancelados: 99 },
  prazo: { noPrazo: 314, atrasados: 45 },
  propostas: { com: 144, sem: 215 },
  conversao: { entrouSem: 215, virouPedido: 148, naoVirou: 67 },
  fat2025: [
    null, null, 57218.31, 107826.7, 156192.11, 102083.74,
    115014.82, 162736.6, 254443.1, 101276.86, 104766.52, 40545.76,
  ],
  meta: null,
  devMes: [null, null, 19, 40, 45, 53, 65, 46, 96, 44, 25, 25],
  kpiC: {
    cat: [
      { key: "des", label: "DESENVOLVIMENTO", valor: 122347.09 },
      { key: "rep", label: "REPOSIÇÃO", valor: 42421.48 },
      { key: "tot", label: "TOTAL", valor: 164768.57 },
    ],
    cc: [
      { key: "psr", label: "PSR", valor: 135223.32 },
      { key: "cli", label: "CLIENTE", valor: 29545.25 },
    ],
    qtd: [
      { key: "des", label: "COMPRAS DESENVOLVIMENTO", qtd: 233 },
      { key: "rep", label: "COMPRAS REPOSIÇÃO", qtd: 63 },
    ],
    prevV: 15000,
    real: [
      null, null, null, 14327.98, 22042.29, 8083.05,
      15440, 6550.36, 7557.92, 15479, 12797, 4147,
    ],
    prevVProd: 5267.77,
    realProd: [
      null, null, null, 9421.31, 7608.27, 2327.23,
      4762, 5267.77, 38.20, 3007, 1894, 4867,
    ],
  },
  kpiF: {
    tot: { venda: 54723.64, compr: 20556.84, rep: 4846.5, nao: 15710.34 },
    devPrev: [null, null, null, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000],
    devReal: [null, null, null, 10878.94, 6556.8, null, null, 748.31, 1308.25, 3983, null, null],
    prPrev: [null, null, null, 8810, 8810, 8810, 8810, 8810, 8810, 8810, 8810, 8810],
    prReal: [null, null, null, 11661.23, 7547.49, 12171.25, 7409, 15922.05, 3277.4, 7154, 8265, 4867],
  },
};

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, AlertTriangle } from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";
import { formatCurrency, formatInteger, MONTHS, getChartColors, svgExport } from "@/lib/formatters";
import type { DashboardData } from "@/data/defaultData";
import { useRef } from "react";

interface FacasSectionProps {
  data: DashboardData;
}

export const FacasSection = ({ data }: FacasSectionProps) => {
  const devRef = useRef<HTMLDivElement>(null);
  const prRef = useRef<HTMLDivElement>(null);
  const colors = getChartColors();

  const { kpiF } = data;
  const { tot } = kpiF;

  const sum = tot.rep + tot.nao;
  const isConsistent = Math.abs(sum - tot.compr) < 0.01;

  const pRep = tot.compr ? (tot.rep / tot.compr) * 100 : 0;
  const pNao = tot.compr ? (tot.nao / tot.compr) * 100 : 0;

  // Development chart data
  const devData = MONTHS.map((mes, i) => ({
    mes,
    real: kpiF.devReal?.[i] ?? null,
    prev: kpiF.devPrev?.[i] ?? null,
  }));

  // Production chart data
  const prData = MONTHS.map((mes, i) => ({
    mes,
    real: kpiF.prReal?.[i] ?? null,
    prev: kpiF.prPrev?.[i] ?? null,
  }));

  const sumArr = (arr: (number | null)[] | undefined) =>
    (arr ?? []).reduce((a: number, v) => a + (typeof v === "number" ? v : 0), 0);

  const devTotPrev = sumArr(kpiF.devPrev);
  const devTotReal = sumArr(kpiF.devReal);
  const devAchievement = devTotPrev ? (devTotReal / devTotPrev) * 100 : 0;

  const prTotPrev = sumArr(kpiF.prPrev);
  const prTotReal = sumArr(kpiF.prReal);
  const prAchievement = prTotPrev ? (prTotReal / prTotPrev) * 100 : 0;

  return (
    <section id="kpi-facas" className="space-y-4">
      <Card className="card-gradient border-border shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-lg font-bold">
              KPI – Compra de facas
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              Totais + Comparativos (Desenvolvimento & Produção)
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-secondary/30 border-border">
              <CardContent className="pt-4 pb-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                  Total de venda (pedidos)
                </h3>
                <p className="text-xl font-extrabold tracking-tight">
                  {formatCurrency(tot.venda)}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-secondary/30 border-border">
              <CardContent className="pt-4 pb-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                  Total de facas compradas
                </h3>
                <p className="text-xl font-extrabold tracking-tight">
                  {formatCurrency(tot.compr)}
                </p>
                <span className="pill mt-2">Soma custos: {formatCurrency(sum)}</span>
                {!isConsistent && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-destructive">
                    <AlertTriangle className="h-3 w-3" />
                    Atenção: repassado + não repassado ≠ total.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-secondary/30 border-border">
              <CardContent className="pt-4 pb-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                  Custo repassado
                </h3>
                <p className="text-xl font-extrabold tracking-tight">
                  {formatCurrency(tot.rep)}
                </p>
                <span className="pill mt-2">{pRep.toFixed(1)}% do total</span>
              </CardContent>
            </Card>

            <Card className="bg-secondary/30 border-border">
              <CardContent className="pt-4 pb-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                  Custo não repassado
                </h3>
                <p className="text-xl font-extrabold tracking-tight">
                  {formatCurrency(tot.nao)}
                </p>
                <span className="pill mt-2">{pNao.toFixed(1)}% do total</span>
              </CardContent>
            </Card>
          </div>

          {/* Development Chart */}
          <div>
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <h3 className="text-sm font-semibold">
                FACAS DESENVOLVIMENTO • PREVISTO × REALIZADO (Abr→Dez)
              </h3>
              <span className="text-xs text-muted-foreground">
                Atingimento: {devAchievement.toFixed(1)}%
              </span>
            </div>
            <div ref={devRef} className="w-full h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={devData}
                  margin={{ top: 16, right: 20, left: 0, bottom: 16 }}
                >
                  <CartesianGrid stroke={colors.grid} />
                  <XAxis dataKey="mes" tick={{ fill: colors.tick, fontSize: 12 }} />
                  <YAxis tick={{ fill: colors.tick, fontSize: 12 }} tickFormatter={formatCurrency} />
                  <Tooltip
                    formatter={(v: number) => formatCurrency(v)}
                    contentStyle={{
                      backgroundColor: "hsl(220 45% 12%)",
                      border: "1px solid hsl(220 30% 22%)",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Legend wrapperStyle={{ color: colors.muted }} />
                  <Bar
                    dataKey="real"
                    name="REALIZADO — PSR"
                    radius={[8, 8, 0, 0]}
                    fill={colors.warningFill}
                    stroke={colors.warning}
                  >
                    <LabelList
                      dataKey="real"
                      position="top"
                      formatter={(v: number | null) => (v != null ? formatCurrency(v) : "")}
                      fill={colors.foreground}
                      fontSize={10}
                    />
                  </Bar>
                  <Line
                    type="monotone"
                    dataKey="prev"
                    name="PREVISTO"
                    stroke={colors.primary}
                    dot={{ r: 3 }}
                    connectNulls={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 p-3 rounded-xl bg-secondary/50 border border-border flex flex-wrap gap-4 justify-end text-xs">
              <span>
                <strong>Total realizado:</strong> {formatCurrency(devTotReal)}
              </span>
              <span>
                <strong>Total previsto:</strong> {formatCurrency(devTotPrev)}
              </span>
              <span className="text-muted-foreground">
                <strong>Atingimento:</strong> {devAchievement.toFixed(1)}%
              </span>
            </div>
            <div className="mt-2 flex justify-end no-print">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const svg = devRef.current?.querySelector("svg");
                  if (svg) svgExport(svg as SVGSVGElement, "facas_dev_previsto_x_realizado_2025.svg");
                }}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Exportar SVG
              </Button>
            </div>
          </div>

          {/* Production Chart */}
          <div>
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <h3 className="text-sm font-semibold">
                FACAS PRODUÇÃO • PREVISTO × REALIZADO (Abr→Dez)
              </h3>
              <span className="text-xs text-muted-foreground">
                Atingimento: {prAchievement.toFixed(1)}%
              </span>
            </div>
            <div ref={prRef} className="w-full h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={prData}
                  margin={{ top: 16, right: 20, left: 0, bottom: 16 }}
                >
                  <CartesianGrid stroke={colors.grid} />
                  <XAxis dataKey="mes" tick={{ fill: colors.tick, fontSize: 12 }} />
                  <YAxis tick={{ fill: colors.tick, fontSize: 12 }} tickFormatter={formatCurrency} />
                  <Tooltip
                    formatter={(v: number) => formatCurrency(v)}
                    contentStyle={{
                      backgroundColor: "hsl(220 45% 12%)",
                      border: "1px solid hsl(220 30% 22%)",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Legend wrapperStyle={{ color: colors.muted }} />
                  <Bar
                    dataKey="real"
                    name="REALIZADO — PSR"
                    radius={[8, 8, 0, 0]}
                    fill={colors.warningFill}
                    stroke={colors.warning}
                  >
                    <LabelList
                      dataKey="real"
                      position="top"
                      formatter={(v: number | null) => (v != null ? formatCurrency(v) : "")}
                      fill={colors.foreground}
                      fontSize={10}
                    />
                  </Bar>
                  <Line
                    type="monotone"
                    dataKey="prev"
                    name="PREVISTO"
                    stroke={colors.primary}
                    dot={{ r: 3 }}
                    connectNulls={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 p-3 rounded-xl bg-secondary/50 border border-border flex flex-wrap gap-4 justify-end text-xs">
              <span>
                <strong>Total realizado:</strong> {formatCurrency(prTotReal)}
              </span>
              <span>
                <strong>Total previsto:</strong> {formatCurrency(prTotPrev)}
              </span>
              <span className="text-muted-foreground">
                <strong>Atingimento:</strong> {prAchievement.toFixed(1)}%
              </span>
            </div>
            <div className="mt-2 flex justify-end no-print">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const svg = prRef.current?.querySelector("svg");
                  if (svg) svgExport(svg as SVGSVGElement, "facas_producao_previsto_x_realizado_2025.svg");
                }}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Exportar SVG
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  ReferenceLine,
} from "recharts";
import { formatCurrency, formatInteger, MONTHS, getChartColors, svgExport } from "@/lib/formatters";
import type { DashboardData } from "@/data/defaultData";
import { useRef } from "react";

interface RevenueEvolutionProps {
  data: DashboardData;
}

export const RevenueEvolution = ({ data }: RevenueEvolutionProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const colors = getChartColors();

  const chartData = MONTHS.map((mes, i) => ({
    mes,
    valor: data.fat2025[i],
    qtd: data.devMes?.[i] ?? null,
  }));

  const validValues = data.fat2025.filter((v): v is number => typeof v === "number");
  const fatTotal = validValues.reduce((a, b) => a + b, 0);
  const fatMedia = validValues.length ? fatTotal / validValues.length : 0;

  const bestMonthIdx = data.fat2025.reduce(
    (mx, v, i) => (v != null && (data.fat2025[mx] ?? -Infinity) < v ? i : mx),
    0
  );
  const worstMonthIdx = data.fat2025.reduce(
    (mn, v, i) => (v != null && (data.fat2025[mn] ?? Infinity) > v ? i : mn),
    0
  );

  const handleExport = () => {
    const svg = chartRef.current?.querySelector("svg");
    if (svg) svgExport(svg as SVGSVGElement, "faturamento_itens_2025.svg");
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="card-gradient border-border shadow-lg">
          <CardContent className="pt-4 pb-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Faturamento total 2025
            </h3>
            <p className="text-2xl font-extrabold tracking-tight">
              {formatCurrency(fatTotal)}
            </p>
            <span className="pill mt-2">Melhor: {MONTHS[bestMonthIdx]}</span>
          </CardContent>
        </Card>
        <Card className="card-gradient border-border shadow-lg">
          <CardContent className="pt-4 pb-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Média mensal (com valor)
            </h3>
            <p className="text-2xl font-extrabold tracking-tight">
              {formatCurrency(fatMedia)}
            </p>
            <span className="pill mt-2">Pior: {MONTHS[worstMonthIdx]}</span>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="card-gradient border-border shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-base font-bold">
              EVOLUÇÃO ANUAL DE FATURAMENTO (2025)
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              Linha: faturado • Barras: itens
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div ref={chartRef} className="w-full h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ top: 16, right: 20, left: 0, bottom: 16 }}
              >
                <defs>
                  <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colors.successFill} />
                    <stop offset="100%" stopColor={colors.successLight} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={colors.grid} />
                <XAxis dataKey="mes" tick={{ fill: colors.tick, fontSize: 12 }} />
                <YAxis
                  yAxisId="L"
                  tick={{ fill: colors.tick, fontSize: 12 }}
                  tickFormatter={(v) => formatCurrency(v)}
                />
                <YAxis
                  yAxisId="R"
                  orientation="right"
                  tick={{ fill: colors.tick, fontSize: 12 }}
                  tickFormatter={(v) => formatInteger(v)}
                  allowDecimals={false}
                />
                <Tooltip
                  formatter={(v: number, name: string) =>
                    name === "Faturado 2025 (R$)" ? formatCurrency(v) : formatInteger(v)
                  }
                  contentStyle={{
                    backgroundColor: "hsl(220 45% 12%)",
                    border: "1px solid hsl(220 30% 22%)",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: colors.foreground }}
                />
                <Legend wrapperStyle={{ color: colors.muted }} />
                <Bar
                  yAxisId="R"
                  dataKey="qtd"
                  name="Itens desenvolvidos"
                  fill={colors.primaryFill}
                  stroke={colors.primary}
                  radius={[6, 6, 6, 6]}
                >
                  <LabelList
                    dataKey="qtd"
                    position="top"
                    formatter={(v: number) => (v ? formatInteger(v) : "")}
                    fill={colors.foreground}
                    fontSize={10}
                  />
                </Bar>
                <Area
                  yAxisId="L"
                  type="monotone"
                  dataKey="valor"
                  stroke="transparent"
                  fill="url(#areaFill)"
                  connectNulls
                />
                <Line
                  yAxisId="L"
                  type="monotone"
                  dataKey="valor"
                  name="Faturado 2025 (R$)"
                  stroke={colors.success}
                  dot={{ r: 3 }}
                  connectNulls
                />
                {data.meta && (
                  <ReferenceLine
                    yAxisId="L"
                    y={data.meta}
                    stroke={colors.primary}
                    strokeDasharray="6 4"
                    label={{
                      value: `Meta: ${formatCurrency(data.meta)}`,
                      position: "top",
                      fill: colors.primary,
                    }}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Info Box */}
          <div className="mt-4 p-3 rounded-xl bg-secondary/50 border border-border flex flex-wrap gap-4 justify-end text-xs">
            <span>
              <strong>Faturado:</strong> {formatCurrency(data.financeiro.faturado)}
            </span>
            <span>
              <strong>Cancelado:</strong> {formatCurrency(data.financeiro.cancelado)}
            </span>
            <span className="text-muted-foreground">
              Itens: {formatInteger(data.itens.finalizados + data.itens.cancelados)} (Fin:{" "}
              {formatInteger(data.itens.finalizados)} • Canc:{" "}
              {formatInteger(data.itens.cancelados)})
            </span>
          </div>

          <div className="mt-4 flex justify-end no-print">
            <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" />
              Exportar SVG
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

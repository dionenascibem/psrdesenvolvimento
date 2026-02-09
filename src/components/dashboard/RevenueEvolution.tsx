import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
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
    valor2025: data.fat2025[i],
    valor2026: data.fat2026[i],
    qtd2025: data.devMes?.[i] ?? null,
    qtd2026: data.devMes2026?.[i] ?? null,
  }));

  const validValues2025 = data.fat2025.filter((v): v is number => typeof v === "number");
  const fatTotal2025 = validValues2025.reduce((a, b) => a + b, 0);
  const fatMedia2025 = validValues2025.length ? fatTotal2025 / validValues2025.length : 0;

  const validValues2026 = data.fat2026.filter((v): v is number => typeof v === "number");
  const fatTotal2026 = validValues2026.reduce((a, b) => a + b, 0);
  const fatMedia2026 = validValues2026.length ? fatTotal2026 / validValues2026.length : 0;

  const handleExport = () => {
    const svg = chartRef.current?.querySelector("svg");
    if (svg) svgExport(svg as SVGSVGElement, "faturamento_comparativo_2025_2026.svg");
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-gradient border-border shadow-lg">
          <CardContent className="pt-4 pb-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Faturamento 2025
            </h3>
            <p className="text-2xl font-extrabold tracking-tight">
              {formatCurrency(fatTotal2025)}
            </p>
            <span className="text-xs text-muted-foreground">
              Média: {formatCurrency(fatMedia2025)}
            </span>
          </CardContent>
        </Card>
        <Card className="card-gradient border-border shadow-lg">
          <CardContent className="pt-4 pb-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Faturamento 2026
            </h3>
            <p className="text-2xl font-extrabold tracking-tight">
              {formatCurrency(fatTotal2026)}
            </p>
            <span className="text-xs text-muted-foreground">
              Média: {formatCurrency(fatMedia2026)}
            </span>
          </CardContent>
        </Card>
        <Card className="card-gradient border-border shadow-lg">
          <CardContent className="pt-4 pb-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Itens 2025
            </h3>
            <p className="text-2xl font-extrabold tracking-tight">
              {formatInteger(data.devMes.filter((v): v is number => v !== null).reduce((a, b) => a + b, 0))}
            </p>
          </CardContent>
        </Card>
        <Card className="card-gradient border-border shadow-lg">
          <CardContent className="pt-4 pb-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Itens 2026
            </h3>
            <p className="text-2xl font-extrabold tracking-tight">
              {formatInteger(data.devMes2026.filter((v): v is number => v !== null).reduce((a, b) => a + b, 0))}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="card-gradient border-border shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-base font-bold">
              COMPARATIVO FATURAMENTO & ITENS — 2025 × 2026
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              Barras: itens • Linhas: faturado
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div ref={chartRef} className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ top: 16, right: 20, left: 0, bottom: 16 }}
              >
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
                    name.includes("R$") ? formatCurrency(v) : formatInteger(v)
                  }
                  contentStyle={{
                    backgroundColor: "hsl(220 45% 12%)",
                    border: "1px solid hsl(220 30% 22%)",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#fff" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Legend wrapperStyle={{ color: colors.muted }} />

                {/* Bars - Items */}
                <Bar
                  yAxisId="R"
                  dataKey="qtd2025"
                  name="Itens 2025"
                  fill={colors.primaryFill}
                  stroke={colors.primary}
                  radius={[4, 4, 0, 0]}
                >
                  <LabelList
                    dataKey="qtd2025"
                    position="top"
                    formatter={(v: number) => (v ? formatInteger(v) : "")}
                    fill={colors.foreground}
                    fontSize={11}
                  />
                </Bar>
                <Bar
                  yAxisId="R"
                  dataKey="qtd2026"
                  name="Itens 2026"
                  fill={colors.emerald}
                  stroke={colors.success}
                  radius={[4, 4, 0, 0]}
                >
                  <LabelList
                    dataKey="qtd2026"
                    position="top"
                    formatter={(v: number) => (v ? formatInteger(v) : "")}
                    fill={colors.foreground}
                    fontSize={11}
                  />
                </Bar>

                {/* Lines - Revenue */}
                <Line
                  yAxisId="L"
                  type="monotone"
                  dataKey="valor2025"
                  name="Faturado 2025 (R$)"
                  stroke={colors.primary}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  connectNulls
                />
                <Line
                  yAxisId="L"
                  type="monotone"
                  dataKey="valor2026"
                  name="Faturado 2026 (R$)"
                  stroke={colors.success}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  connectNulls
                  strokeDasharray="6 3"
                />

                {data.meta && (
                  <ReferenceLine
                    yAxisId="L"
                    y={data.meta}
                    stroke={colors.warning}
                    strokeDasharray="6 4"
                    label={{
                      value: `Meta: ${formatCurrency(data.meta)}`,
                      position: "top",
                      fill: colors.warning,
                    }}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Info Box */}
          <div className="mt-4 p-3 rounded-xl bg-secondary/50 border border-border flex flex-wrap gap-4 justify-end text-xs">
            <span>
              <strong>Faturado 2025:</strong> {formatCurrency(data.financeiro.faturado)}
            </span>
            <span>
              <strong>Cancelado:</strong> {formatCurrency(data.financeiro.cancelado)}
            </span>
            <span className="text-muted-foreground">
              Itens 2025: {formatInteger(data.itens.finalizados + data.itens.cancelados)} (Fin:{" "}
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

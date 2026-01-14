import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";
import { formatCurrency, formatInteger, getChartColors, svgExport } from "@/lib/formatters";
import type { DashboardData } from "@/data/defaultData";
import { useRef } from "react";

interface ProductsChartProps {
  data: DashboardData;
}

export const ProductsChart = ({ data }: ProductsChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const colors = getChartColors();

  const chartData = [
    ...data.produtos,
    { nome: "TOTAL", qtd: data.total.qtd, valor: data.total.valor },
  ];

  const handleExport = () => {
    const svg = chartRef.current?.querySelector("svg");
    if (svg) svgExport(svg as SVGSVGElement, "produtos_x_valor_2025.svg");
  };

  return (
    <Card className="card-gradient border-border shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-base font-bold">
            PRODUTOS × VALOR DE VENDA
          </CardTitle>
          <span className="text-xs text-muted-foreground">
            Passe o mouse para detalhes
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={chartRef} className="w-full h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 0, bottom: 16 }}
            >
              <defs>
                <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.primaryFill} />
                  <stop offset="100%" stopColor={colors.primaryLight} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={colors.grid} />
              <XAxis dataKey="nome" tick={{ fill: colors.tick, fontSize: 12 }} />
              <YAxis tick={{ fill: colors.tick, fontSize: 12 }} tickFormatter={(v) => formatCurrency(v)} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: "hsl(220 45% 12%)",
                  border: "1px solid hsl(220 30% 22%)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#fff" }}
                itemStyle={{ color: "#fff" }}
              />
              <Legend wrapperStyle={{ color: colors.muted }} />
              <Bar
                dataKey="valor"
                name="Valor de venda (R$)"
                fill="url(#barFill)"
                radius={[8, 8, 0, 0]}
                animationDuration={900}
              >
                <LabelList
                  dataKey="valor"
                  position="top"
                  formatter={(v: number) => formatCurrency(v)}
                  fill={colors.foreground}
                  fontSize={11}
                />
                <LabelList
                  dataKey="qtd"
                  position="insideBottom"
                  formatter={(v: number) => formatInteger(v)}
                  fill={colors.muted}
                  fontSize={10}
                  offset={8}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-end no-print">
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Exportar SVG
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

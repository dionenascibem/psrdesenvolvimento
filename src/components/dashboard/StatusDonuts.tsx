import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { formatInteger, getChartColors, svgExport } from "@/lib/formatters";
import type { DashboardData } from "@/data/defaultData";
import { useRef } from "react";

interface DonutChartProps {
  title: string;
  subtitle?: string;
  data: { label: string; value: number }[];
  colors: string[];
  chartId: string;
  filename: string;
}

const DonutChart = ({
  title,
  subtitle,
  data,
  colors,
  chartId,
  filename,
}: DonutChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartColors = getChartColors();
  const total = data.reduce((a, b) => a + b.value, 0);

  const handleExport = () => {
    const svg = chartRef.current?.querySelector("svg");
    if (svg) svgExport(svg as SVGSVGElement, filename);
  };

  return (
    <Card className="card-gradient border-border shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-base font-bold">{title}</CardTitle>
          {subtitle && (
            <span className="text-xs text-muted-foreground">{subtitle}</span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div ref={chartRef} id={chartId} className="w-full h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                formatter={(v: number) => {
                  const pct = total ? ((v / total) * 100).toFixed(1) + "%" : "0%";
                  return [`${formatInteger(v)} (${pct})`];
                }}
                contentStyle={{
                  backgroundColor: "hsl(220 45% 12%)",
                  border: "1px solid hsl(220 30% 22%)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: chartColors.foreground }}
              />
              <Legend wrapperStyle={{ color: chartColors.muted }} />
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                innerRadius={55}
                outerRadius={90}
                animationDuration={900}
                labelLine
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={colors[i]} stroke={colors[i]} />
                ))}
              </Pie>
              <text
                x="50%"
                y="45%"
                textAnchor="middle"
                fill={chartColors.muted}
                fontSize="11"
              >
                Itens
              </text>
              <text
                x="50%"
                y="55%"
                textAnchor="middle"
                fill={chartColors.foreground}
                fontSize="14"
                fontWeight="700"
              >
                {formatInteger(total)}
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex justify-end no-print">
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Exportar SVG
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface StatusDonutsProps {
  data: DashboardData;
}

export const StatusDonuts = ({ data }: StatusDonutsProps) => {
  const colors = getChartColors();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DonutChart
        title="FINALIZADOS × CANCELADOS (2025)"
        data={[
          { label: "Finalizados", value: data.itens.finalizados },
          { label: "Cancelados", value: data.itens.cancelados },
        ]}
        colors={[colors.success, colors.destructive]}
        chartId="fin-vs-canc"
        filename="finalizados_cancelados_2025.svg"
      />

      <DonutChart
        title="DESENVOLVIMENTOS NO PRAZO"
        subtitle={`Base: ${formatInteger(data.itens.finalizados)} finalizados`}
        data={[
          { label: "Atrasados", value: data.prazo.atrasados },
          { label: "No prazo", value: data.prazo.noPrazo },
        ]}
        colors={[colors.destructive, colors.success]}
        chartId="prazo"
        filename="prazo_2025.svg"
      />

      <DonutChart
        title="COM × SEM PROPOSTA"
        subtitle={`Base: ${formatInteger(data.itens.finalizados)} finalizados`}
        data={[
          { label: "Sem proposta", value: data.propostas.sem },
          { label: "Com proposta", value: data.propostas.com },
        ]}
        colors={[colors.rose, colors.emerald]}
        chartId="props"
        filename="com_sem_proposta_2025.svg"
      />
    </div>
  );
};

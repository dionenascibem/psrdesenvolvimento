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
  Cell,
  LabelList,
} from "recharts";
import { formatInteger, getChartColors, svgExport } from "@/lib/formatters";
import type { DashboardData } from "@/data/defaultData";
import { useRef } from "react";

interface ConversionChartProps {
  data: DashboardData;
}

export const ConversionChart = ({ data }: ConversionChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const colors = getChartColors();

  const chartData = [
    { label: "Entrou com proposta", value: data.propostas.com },
    { label: "Entrou sem proposta", value: data.conversao.entrouSem },
    { label: "Virou pedido", value: data.conversao.virouPedido },
    { label: "Não virou pedido", value: data.conversao.naoVirou },
  ];

  const barColors = [colors.emerald, colors.warning, colors.success, colors.destructive];
  const base = data.conversao.entrouSem;

  const handleExport = () => {
    const svg = chartRef.current?.querySelector("svg");
    if (svg) svgExport(svg as SVGSVGElement, "conversao_sem_proposta_2025.svg");
  };

  return (
    <Card className="card-gradient border-border shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-base font-bold">
            VIROU × NÃO VIROU (sem proposta)
          </CardTitle>
          <span className="text-xs text-muted-foreground">
            Base: {formatInteger(base)}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={chartRef} className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 16, right: 20, left: 0, bottom: 16 }}
            >
              <CartesianGrid stroke={colors.grid} />
              <XAxis
                dataKey="label"
                tick={{ fill: colors.tick, fontSize: 11 }}
                interval={0}
                angle={-15}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fill: colors.tick, fontSize: 12 }}
                tickFormatter={(v) => formatInteger(v)}
              />
              <Tooltip
                formatter={(v: number, name: string, props: any) => {
                  const label = props.payload.label;
                  let extra = "";
                  if (label === "Virou pedido" || label === "Não virou pedido") {
                    const pct = base ? ((v / base) * 100).toFixed(1) + "%" : "0%";
                    extra = ` (${pct})`;
                  }
                  return [`${formatInteger(v)}${extra}`, "Itens"];
                }}
                contentStyle={{
                  backgroundColor: "blue",
                  border: "1px solid hsl(220 30% 22%)",
                  borderRadius: "8px",
                  
                }}
                labelStyle={{ color: colors.foreground }}
              />
              <Bar dataKey="value" animationDuration={900} radius={[6, 6, 0, 0]}>
                <LabelList
                  dataKey="value"
                  position="top"
                  formatter={(v: number) => formatInteger(v)}
                  fill={colors.foreground}
                  fontSize={11}
                />
                {chartData.map((_, i) => (
                  <Cell key={i} fill={barColors[i]} stroke={barColors[i]} />
                ))}
              </Bar>
            </BarChart>
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

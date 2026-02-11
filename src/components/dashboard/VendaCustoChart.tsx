import { useState, useRef } from "react";
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
import { formatCurrency, getChartColors, svgExport } from "@/lib/formatters";
import type { DashboardData, VendaCustoItem } from "@/data/defaultData";

interface VendaCustoChartProps {
  data: DashboardData;
}

type FilterKey = "ETQ" | "BOB" | "ROT";

export const VendaCustoChart = ({ data }: VendaCustoChartProps) => {
  const [filter, setFilter] = useState<FilterKey>("ETQ");
  const chartRef = useRef<HTMLDivElement>(null);
  const colors = getChartColors();

  const items: VendaCustoItem[] = data.vendaCusto?.[filter] ?? [];

  const chartData = items.map((item) => {
    const pct = item.venda ? ((item.custo / item.venda) * 100).toFixed(1) : "0.0";
    return {
      label: `${item.tipo}\n${item.codigo}\n${item.pedido}`,
      shortLabel: item.codigo,
      venda: item.venda,
      custo: item.custo,
      repassado: item.repassado,
      cliente: item.cliente,
      pct,
    };
  });

  const totalVenda = items.reduce((s, i) => s + i.venda, 0);
  const totalCusto = items.reduce((s, i) => s + i.custo, 0);
  const totalPct = totalVenda ? ((totalCusto / totalVenda) * 100).toFixed(1) : "0.0";

  const handleExport = () => {
    const svg = chartRef.current?.querySelector("svg");
    if (svg) svgExport(svg as SVGSVGElement, `venda_custo_cliches_${filter.toLowerCase()}.svg`);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0]?.payload;
    return (
      <div
        style={{
          backgroundColor: "hsl(220 45% 12%)",
          border: "1px solid hsl(220 30% 22%)",
          borderRadius: "8px",
          padding: "10px 14px",
          color: "#fff",
          fontSize: 13,
        }}
      >
        <p className="font-semibold mb-1">{d.cliente || d.shortLabel}</p>
        <p>
          Venda: <span className="font-medium">{formatCurrency(d.venda)}</span>
        </p>
        <p>
          Custo:{" "}
          <span
            className="font-medium"
            style={{ color: d.repassado ? colors.success : colors.destructive }}
          >
            {formatCurrency(d.custo)} ({d.pct}%)
          </span>
        </p>
        <p className="text-xs mt-1" style={{ color: d.repassado ? colors.success : colors.destructive }}>
          {d.repassado ? "Repassado ao cliente" : "Não repassado ao cliente"}
        </p>
      </div>
    );
  };

  return (
    <Card className="card-gradient border-border shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-base font-bold">
            VALOR DE VENDA × CUSTO DE CLICHÊS
          </CardTitle>
          <span className="text-xs text-muted-foreground">
            Custo total: {totalPct}% da venda
          </span>
          <div className="flex gap-1">
            {(["ETQ", "BOB", "ROT"] as FilterKey[]).map((key) => (
              <Button
                key={key}
                variant={filter === key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(key)}
                className={
                  filter === key
                    ? "bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:bg-muted"
                }
              >
                {key}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={chartRef} className="w-full h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 10, bottom: 60 }}
            >
              <CartesianGrid stroke={colors.grid} />
              <XAxis
                dataKey="shortLabel"
                tick={{ fill: colors.tick, fontSize: 12 }}
                interval={0}
              />
              <YAxis
                tick={{ fill: colors.tick, fontSize: 12 }}
                tickFormatter={(v) => formatCurrency(v)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="venda" name="Venda" animationDuration={900} radius={[6, 6, 0, 0]}>
                <LabelList
                  dataKey="venda"
                  position="top"
                  formatter={(v: number) => formatCurrency(v)}
                  fill={colors.foreground}
                  fontSize={12}
                  fontWeight={600}
                />
                {chartData.map((_, i) => (
                  <Cell key={`v-${i}`} fill={colors.primary} />
                ))}
              </Bar>
              <Bar dataKey="custo" name="Custo" animationDuration={900} radius={[6, 6, 0, 0]}>
                <LabelList
                  dataKey="custo"
                  position="top"
                  formatter={(v: number) => v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  fill={colors.foreground}
                  fontSize={12}
                  fontWeight={600}
                />
                {chartData.map((entry, i) => (
                  <Cell
                    key={`c-${i}`}
                    fill={entry.repassado ? colors.success : colors.destructive}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex items-center justify-between flex-wrap gap-2 no-print">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm" style={{ background: colors.success }} />
              Repassado
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm" style={{ background: colors.destructive }} />
              Não repassado
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Exportar SVG
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

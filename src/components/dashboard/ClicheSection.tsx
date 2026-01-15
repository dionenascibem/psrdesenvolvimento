import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  LabelList,
} from "recharts";
import { formatCurrency, formatInteger, MONTHS, getChartColors, svgExport } from "@/lib/formatters";
import type { DashboardData } from "@/data/defaultData";
import { useRef } from "react";

interface ClicheSectionProps {
  data: DashboardData;
}

export const ClicheSection = ({ data }: ClicheSectionProps) => {
  const prevRealRef = useRef<HTMLDivElement>(null);
  const catRef = useRef<HTMLDivElement>(null);
  const ccRef = useRef<HTMLDivElement>(null);
  const qtdRef = useRef<HTMLDivElement>(null);
  const colors = getChartColors();

  const { kpiC } = data;
  const prevV = kpiC.prevV ?? 15000;

  // Predicted vs Actual data
  const prevRealData = MONTHS.map((mes, i) => ({
    mes,
    real: kpiC.real?.[i] ?? null,
    prev: prevV,
  }));

  const totPrev = prevV * 12;
  const totReal = (kpiC.real ?? []).reduce(
    (a: number, v) => a + (typeof v === "number" ? v : 0),
    0
  );
  const achievement = totPrev ? (totReal / totPrev) * 100 : 0;

  // Colors for category charts
  const catColors: Record<string, string> = {
    des: colors.primary,
    rep: colors.warning,
    tot: colors.success,
  };
  const ccColors: Record<string, string> = {
    psr: colors.warning,
    cli: colors.success,
  };
  const qtdColors: Record<string, string> = {
    des: colors.primary,
    rep: colors.warning,
  };

  return (
    <section id="kpi-cliches" className="space-y-4">
      <Card className="card-gradient border-border shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-lg font-bold">
              KPI – Compra de clichês
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              Previsto × Realizado + Detalhes
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Predicted vs Actual Chart */}
          <div>
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <h3 className="text-sm font-semibold">CLICHÊS • PREVISTO × REALIZADO</h3>
              <span className="text-xs text-muted-foreground">
                Previsto fixo: {formatCurrency(prevV)} / mês • Atingimento:{" "}
                {achievement.toFixed(1)}%
              </span>
            </div>
            <div ref={prevRealRef} className="w-full h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={prevRealData}
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
                      fontSize={12}
                    />
                  </Bar>
                  <Line
                    type="monotone"
                    dataKey="prev"
                    name="PREVISTO"
                    stroke={colors.primary}
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 p-3 rounded-xl bg-secondary/50 border border-border flex flex-wrap gap-4 justify-end text-xs">
              <span>
                <strong>Total realizado:</strong> {formatCurrency(totReal)}
              </span>
              <span>
                <strong>Total previsto:</strong> {formatCurrency(totPrev)}
              </span>
              <span className="text-muted-foreground">
                <strong>Atingimento:</strong> {achievement.toFixed(1)}%
              </span>
            </div>
            <div className="mt-2 flex justify-end no-print">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const svg = prevRealRef.current?.querySelector("svg");
                  if (svg) svgExport(svg as SVGSVGElement, "cliches_previsto_x_realizado_2025.svg");
                }}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Exportar SVG
              </Button>
            </div>
          </div>

          {/* Detail Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Category Chart */}
            <Card className="bg-secondary/30 border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">
                  CLICHÊS • POR CATEGORIA (R$)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div ref={catRef} className="w-full h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={kpiC.cat}
                      margin={{ top: 18, right: 8, left: 0, bottom: 8 }}
                    >
                      <CartesianGrid stroke={colors.grid} />
                      <XAxis dataKey="label" tick={{ fill: colors.tick, fontSize: 12 }} />
                      <YAxis tick={{ fill: colors.tick, fontSize: 12 }} tickFormatter={formatCurrency} />
                      <Tooltip
                        formatter={(v: number) => formatCurrency(v)}
                        contentStyle={{
                          backgroundColor: "hsl(220 45% 12%)",
                          border: "1px solid hsl(220 30% 22%)",
                          borderRadius: "8px",
                        }}
                        labelStyle={{ color: "#fff" }}
                        itemStyle={{ color: "#fff" }}
                      />
                      <Bar dataKey="valor" name="Realizado (R$)" radius={[6, 6, 0, 0]}>
                        {kpiC.cat.map((item, i) => (
                          <Cell key={i} fill={catColors[item.key] || colors.primary} />
                        ))}
                        <LabelList
                          dataKey="valor"
                          position="top"
                          formatter={(v: number) => formatCurrency(v)}
                          fill={colors.foreground}
                          fontSize={12}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 flex justify-end no-print">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const svg = catRef.current?.querySelector("svg");
                      if (svg) svgExport(svg as SVGSVGElement, "cliches_cat.svg");
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Cost Center Chart */}
            <Card className="bg-secondary/30 border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">
                  CLICHÊS • CENTRO DE CUSTO (R$)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div ref={ccRef} className="w-full h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={kpiC.cc}
                      margin={{ top: 18, right: 8, left: 0, bottom: 8 }}
                    >
                      <CartesianGrid stroke={colors.grid} />
                      <XAxis dataKey="label" tick={{ fill: colors.tick, fontSize: 12 }} />
                      <YAxis tick={{ fill: colors.tick, fontSize: 12 }} tickFormatter={formatCurrency} />
                      <Tooltip
                        formatter={(v: number) => formatCurrency(v)}
                        contentStyle={{
                          backgroundColor: "hsl(220 45% 12%)",
                          border: "1px solid hsl(220 30% 22%)",
                          borderRadius: "8px",
                        }}
                        labelStyle={{ color: "#fff" }}
                        itemStyle={{ color: "#fff" }}
                      />
                      <Bar dataKey="valor" name="Realizado (R$)" radius={[6, 6, 0, 0]}>
                        {kpiC.cc.map((item, i) => (
                          <Cell key={i} fill={ccColors[item.key] || colors.primary} />
                        ))}
                        <LabelList
                          dataKey="valor"
                          position="top"
                          formatter={(v: number) => formatCurrency(v)}
                          fill={colors.foreground}
                          fontSize={12}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 flex justify-end no-print">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const svg = ccRef.current?.querySelector("svg");
                      if (svg) svgExport(svg as SVGSVGElement, "cliches_cc.svg");
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quantity Chart */}
            <Card className="bg-secondary/30 border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">
                  CLICHÊS • QTD (DESENV × REPOSIÇÃO)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div ref={qtdRef} className="w-full h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={kpiC.qtd}
                      layout="vertical"
                      margin={{ top: 12, right: 20, left: 0, bottom: 8 }}
                    >
                      <CartesianGrid stroke={colors.grid} />
                      <YAxis
                        type="category"
                        dataKey="label"
                        tick={{ fill: colors.tick, fontSize: 12 }}
                        width={100}
                      />
                      <XAxis
                        type="number"
                        tick={{ fill: colors.tick, fontSize: 12 }}
                        tickFormatter={formatInteger}
                        allowDecimals={false}
                      />
                      <Tooltip
                        formatter={(v: number) => formatInteger(v)}
                        contentStyle={{
                          backgroundColor: "hsl(220 45% 12%)",
                          border: "1px solid hsl(220 30% 22%)",
                          borderRadius: "8px",
                        }}
                        labelStyle={{ color: "#fff" }}
                        itemStyle={{ color: "#fff" }}
                      />
                      <Bar dataKey="qtd" name="Quantidade" radius={[6, 6, 6, 6]}>
                        {kpiC.qtd.map((item, i) => (
                          <Cell key={i} fill={qtdColors[item.key] || colors.primary} />
                        ))}
                        <LabelList
                          dataKey="qtd"
                          position="right"
                          formatter={(v: number) => formatInteger(v)}
                          fill={colors.foreground}
                          fontSize={12}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 flex justify-end no-print">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const svg = qtdRef.current?.querySelector("svg");
                      if (svg) svgExport(svg as SVGSVGElement, "cliches_qtd.svg");
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

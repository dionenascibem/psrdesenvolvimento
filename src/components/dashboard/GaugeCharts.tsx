import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardData } from "@/data/defaultData";

interface GaugeChartsProps {
  data: DashboardData;
}

interface GaugeConfig {
  title: string;
  subtitle: string;
  value: number; // média em dias
  thresholds: { otimo: number; bom: number; regular: number }; // limites superiores
}

const getLevel = (
  dias: number,
  t: { otimo: number; bom: number; regular: number }
): { label: string; pct: number; color: string } => {
  if (dias <= t.otimo) return { label: "ÓTIMO", pct: 100, color: "hsl(142 71% 45%)" };
  if (dias <= t.bom) return { label: "BOM", pct: 75, color: "hsl(82 70% 45%)" };
  if (dias <= t.regular) return { label: "REGULAR", pct: 50, color: "hsl(48 96% 53%)" };
  return { label: "RUIM", pct: 25, color: "hsl(0 84% 60%)" };
};

const GaugeSVG = ({
  pct,
  color,
  label,
  dias,
}: {
  pct: number;
  color: string;
  label: string;
  dias: number;
}) => {
  const cx = 100;
  const cy = 95;
  const r = 70;
  const startAngle = Math.PI;
  const endAngle = 0;
  const totalArc = Math.PI;

  // Background arc segments (4 sections)
  const segmentColors = [
    "hsl(0 84% 60%)",      // RUIM
    "hsl(48 96% 53%)",     // REGULAR
    "hsl(82 70% 45%)",     // BOM
    "hsl(142 71% 45%)",    // ÓTIMO
  ];
  const segmentBounds = [0, 0.25, 0.5, 0.75, 1];

  const arcPath = (startFrac: number, endFrac: number) => {
    const a1 = startAngle - startFrac * totalArc;
    const a2 = startAngle - endFrac * totalArc;
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy - r * Math.sin(a1);
    const x2 = cx + r * Math.cos(a2);
    const y2 = cy - r * Math.sin(a2);
    const largeArc = endFrac - startFrac > 0.5 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 0 ${x2} ${y2}`;
  };

  // Needle angle
  const needleFrac = pct / 100;
  const needleAngle = startAngle - needleFrac * totalArc;
  const needleLen = r - 10;
  const nx = cx + needleLen * Math.cos(needleAngle);
  const ny = cy - needleLen * Math.sin(needleAngle);

  return (
    <svg viewBox="0 0 200 120" className="w-full max-w-[220px] mx-auto">
      {/* Background segments */}
      {segmentColors.map((segColor, i) => (
        <path
          key={i}
          d={arcPath(segmentBounds[i], segmentBounds[i + 1])}
          fill="none"
          stroke={segColor}
          strokeWidth="14"
          strokeLinecap="butt"
          opacity={0.3}
        />
      ))}

      {/* Active arc up to needle */}
      {segmentColors.map((segColor, i) => {
        const segStart = segmentBounds[i];
        const segEnd = segmentBounds[i + 1];
        if (needleFrac <= segStart) return null;
        const clampEnd = Math.min(needleFrac, segEnd);
        return (
          <path
            key={`active-${i}`}
            d={arcPath(segStart, clampEnd)}
            fill="none"
            stroke={segColor}
            strokeWidth="14"
            strokeLinecap="butt"
          />
        );
      })}

      {/* Needle */}
      <line
        x1={cx}
        y1={cy}
        x2={nx}
        y2={ny}
        stroke="hsl(210 40% 94%)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r="5" fill="hsl(210 40% 94%)" />

      {/* Center text */}
      <text
        x={cx}
        y={cy + 18}
        textAnchor="middle"
        fill="hsl(210 40% 94%)"
        fontSize="18"
        fontWeight="bold"
      >
        {pct}%
      </text>
    </svg>
  );
};

export const GaugeCharts = ({ data }: GaugeChartsProps) => {
  const gauges: GaugeConfig[] = [
    {
      title: "TEMPO DE RESPOSTA",
      subtitle: "DESENVOLVIMENTO",
      value: data.tempoResposta?.desenvolvimento ?? 1.5,
      thresholds: { otimo: 2, bom: 3, regular: 5 },
    },
    {
      title: "TEMPO DE RESPOSTA",
      subtitle: "COMERCIAL",
      value: data.tempoResposta?.comercial ?? 1.5,
      thresholds: { otimo: 2, bom: 3, regular: 5 },
    },
    {
      title: "TEMPO DE CHEGADA",
      subtitle: "CLICHÊ",
      value: data.tempoResposta?.cliche ?? 3,
      thresholds: { otimo: 4, bom: 6, regular: 8 },
    },
  ];

  return (
    <Card className="card-gradient border-border shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold">
          INDICADORES DE TEMPO DE RESPOSTA
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          {gauges.map((g, i) => {
            const level = getLevel(g.value, g.thresholds);
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide text-center">
                  {g.title}
                </span>
                <span className="text-xs font-bold text-foreground uppercase tracking-wide text-center">
                  {g.subtitle}
                </span>
                <GaugeSVG
                  pct={level.pct}
                  color={level.color}
                  label={level.label}
                  dias={g.value}
                />
                <span className="text-xs text-muted-foreground">
                  Média: {g.value.toFixed(1)} dias — <strong style={{ color: level.color }}>{level.label}</strong>
                </span>
              </div>
            );
          })}

          {/* Legend */}
          <div className="flex flex-col gap-2 justify-center h-full">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Legenda
            </span>
            {[
              { color: "hsl(142 71% 45%)", label: "ÓTIMO" },
              { color: "hsl(82 70% 45%)", label: "BOM" },
              { color: "hsl(48 96% 53%)", label: "REGULAR" },
              { color: "hsl(0 84% 60%)", label: "RUIM" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span
                  className="inline-block w-4 h-4 rounded-sm"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs font-semibold text-foreground">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

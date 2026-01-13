export const formatCurrency = (value: number | null | undefined): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(value ?? 0);
};

export const formatInteger = (value: number | null | undefined): string => {
  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 0,
  }).format(value ?? 0);
};

export const formatPercent = (value: number, total: number): string => {
  if (!total) return "0%";
  return ((value / total) * 100).toFixed(1) + "%";
};

export const MONTHS = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

export const getChartColors = () => ({
  primary: "hsl(217 91% 60%)",
  primaryFill: "hsla(217, 91%, 60%, 0.5)",
  primaryLight: "hsla(217, 91%, 60%, 0.15)",
  success: "hsl(142 71% 45%)",
  successFill: "hsla(142, 71%, 45%, 0.45)",
  successLight: "hsla(142, 71%, 45%, 0.08)",
  warning: "hsl(48 96% 53%)",
  warningFill: "hsla(48, 96%, 53%, 0.7)",
  destructive: "hsl(0 84% 60%)",
  destructiveFill: "hsla(0, 84%, 60%, 0.85)",
  muted: "hsl(215 25% 68%)",
  foreground: "hsl(210 40% 94%)",
  grid: "hsla(215, 25%, 68%, 0.18)",
  tick: "hsl(210 50% 90%)",
  emerald: "hsla(160, 84%, 39%, 0.85)",
  rose: "hsla(350, 89%, 60%, 0.85)",
});

export const svgExport = (element: SVGSVGElement | null, filename: string) => {
  if (!element) return;
  
  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(element);
  
  // Add background color
  source = source.replace(
    "<svg ",
    '<svg style="background: hsl(220 50% 8%)" '
  );
  
  const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".svg") ? filename : filename + ".svg";
  document.body.appendChild(a);
  a.click();
  a.remove();
};

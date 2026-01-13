import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatInteger } from "@/lib/formatters";
import type { DashboardData } from "@/data/defaultData";

interface KPICardsProps {
  data: DashboardData;
}

export const KPICards = ({ data }: KPICardsProps) => {
  const productDetails = data.produtos
    .map((p) => `${p.nome} ${formatInteger(p.qtd)}`)
    .join(" • ");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="card-gradient border-border shadow-lg">
        <CardContent className="pt-4 pb-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            Quantidade total (2025)
          </h3>
          <p className="text-2xl font-extrabold tracking-tight">
            {formatInteger(data.total.qtd)}
          </p>
          <span className="pill mt-2">{productDetails}</span>
        </CardContent>
      </Card>

      <Card className="card-gradient border-border shadow-lg">
        <CardContent className="pt-4 pb-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            Valor total de venda
          </h3>
          <p className="text-2xl font-extrabold tracking-tight">
            {formatCurrency(data.total.valor)}
          </p>
        </CardContent>
      </Card>

      <Card className="card-gradient border-border shadow-lg">
        <CardContent className="pt-4 pb-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            Faturado
          </h3>
          <p className="text-2xl font-extrabold tracking-tight">
            {formatCurrency(data.financeiro.faturado)}
          </p>
          <span className="pill mt-2">
            Cancelado {formatCurrency(data.financeiro.cancelado)}
          </span>
        </CardContent>
      </Card>

      <Card className="card-gradient border-border shadow-lg">
        <CardContent className="pt-4 pb-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            Status
          </h3>
          <p className="text-2xl font-extrabold tracking-tight text-primary">
            Pronto
          </p>
          <span className="pill mt-2">Dashboard Ativo</span>
        </CardContent>
      </Card>
    </div>
  );
};

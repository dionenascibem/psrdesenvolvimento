import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import logo from "@/assets/logo-psr.png";

interface HeaderProps {
  onNavigate: (id: string) => void;
  children?: ReactNode;
}

export const Header = ({ onNavigate, children }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-10 header-gradient border-b border-border shadow-lg backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="PSR Logo"
            className="h-10 md:h-12 drop-shadow-lg"
          />
          <div className="flex flex-col">
            <h1 className="text-lg md:text-xl font-extrabold tracking-tight">
              KPI – Performance & Aquisições (2025)
            </h1>
            <span className="text-xs text-muted-foreground">
              Painel de indicadores • PSR
            </span>
          </div>
        </div>

        <nav className="flex gap-2 flex-wrap no-print items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="gap-2"
          >
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Imprimir</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate("top")}
          >
            Topo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate("kpi-cliches")}
          >
            Clichês
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate("kpi-facas")}
          >
            Facas
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate("json-editor")}
          >
            Dados
          </Button>
          {children}
        </nav>
      </div>
    </header>
  );
};

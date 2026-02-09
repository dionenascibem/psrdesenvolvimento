import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, AlertCircle } from "lucide-react";
import type { DashboardData } from "@/data/defaultData";

interface JsonEditorProps {
  data: DashboardData;
  onApply: (newData: DashboardData) => void;
}

export const JsonEditor = ({ data, onApply }: JsonEditorProps) => {
  const [json, setJson] = useState(() =>
    JSON.stringify(
      {
        produtos: data.produtos,
        total: data.total,
        financeiro: data.financeiro,
        itens: data.itens,
        prazo: data.prazo,
        propostas: data.propostas,
        conversao: data.conversao,
        fat2025: data.fat2025,
        fat2026: data.fat2026,
        meta: data.meta,
        devMes: data.devMes,
        devMes2026: data.devMes2026,
        kpiC: data.kpiC,
        kpiF: data.kpiF,
      },
      null,
      2
    )
  );

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleApply = () => {
    try {
      const parsed = JSON.parse(json);
      const newData: DashboardData = { ...data };

      // Products
      if (Array.isArray(parsed.produtos)) {
        newData.produtos = parsed.produtos.map((p: any) => ({
          nome: p.nome ?? "Item",
          qtd: +(p.qtd ?? 0),
          valor: +(p.valor ?? 0),
        }));
      }

      // Total
      if (parsed.total) {
        newData.total = {
          qtd: +(parsed.total.qtd ?? newData.produtos.reduce((a, b) => a + b.qtd, 0)),
          valor: +(parsed.total.valor ?? newData.produtos.reduce((a, b) => a + b.valor, 0)),
        };
      }

      // Financeiro
      if (parsed.financeiro) {
        newData.financeiro = {
          faturado: +(parsed.financeiro.faturado ?? newData.financeiro.faturado),
          cancelado: +(parsed.financeiro.cancelado ?? newData.financeiro.cancelado),
        };
      }

      // Itens
      if (parsed.itens) {
        newData.itens = {
          finalizados: +(parsed.itens.finalizados ?? newData.itens.finalizados),
          cancelados: +(parsed.itens.cancelados ?? newData.itens.cancelados),
        };
      }

      // Prazo
      if (parsed.prazo) {
        newData.prazo = {
          noPrazo: +(parsed.prazo.noPrazo ?? newData.prazo.noPrazo),
          atrasados: +(parsed.prazo.atrasados ?? newData.prazo.atrasados),
        };
      }

      // Propostas
      if (parsed.propostas) {
        newData.propostas = {
          com: +(parsed.propostas.com ?? newData.propostas.com),
          sem: +(parsed.propostas.sem ?? newData.propostas.sem),
        };
      }

      // Conversao
      if (parsed.conversao) {
        newData.conversao = {
          entrouSem: +(parsed.conversao.entrouSem ?? newData.conversao.entrouSem),
          virouPedido: +(parsed.conversao.virouPedido ?? newData.conversao.virouPedido),
          naoVirou: +(parsed.conversao.naoVirou ?? newData.conversao.naoVirou),
        };
      }

      // Monthly arrays
      if (Array.isArray(parsed.fat2025) && parsed.fat2025.length === 12) {
        newData.fat2025 = parsed.fat2025.map((v: any) => (v === null ? null : +v));
      }

      if (Array.isArray(parsed.fat2026) && parsed.fat2026.length === 12) {
        newData.fat2026 = parsed.fat2026.map((v: any) => (v === null ? null : +v));
      }

      newData.meta = parsed.meta === null || parsed.meta === undefined ? null : +parsed.meta;

      if (Array.isArray(parsed.devMes) && parsed.devMes.length === 12) {
        newData.devMes = parsed.devMes.map((v: any) => (v === null ? null : +v));
      }

      if (Array.isArray(parsed.devMes2026) && parsed.devMes2026.length === 12) {
        newData.devMes2026 = parsed.devMes2026.map((v: any) => (v === null ? null : +v));
      }

      // KPI Clichês
      if (parsed.kpiC) {
        newData.kpiC = { ...newData.kpiC };
        if (Array.isArray(parsed.kpiC.cat)) {
          newData.kpiC.cat = parsed.kpiC.cat.map((x: any) => ({
            key: String(x.key ?? ""),
            label: String(x.label ?? ""),
            valor: +(x.valor ?? 0),
          }));
        }
        if (Array.isArray(parsed.kpiC.cc)) {
          newData.kpiC.cc = parsed.kpiC.cc.map((x: any) => ({
            key: String(x.key ?? ""),
            label: String(x.label ?? ""),
            valor: +(x.valor ?? 0),
          }));
        }
        if (Array.isArray(parsed.kpiC.qtd)) {
          newData.kpiC.qtd = parsed.kpiC.qtd.map((x: any) => ({
            key: String(x.key ?? ""),
            label: String(x.label ?? ""),
            qtd: +(x.qtd ?? 0),
          }));
        }
        if (typeof parsed.kpiC.prevV !== "undefined") {
          newData.kpiC.prevV = +(parsed.kpiC.prevV ?? newData.kpiC.prevV ?? 15000);
        }
        if (Array.isArray(parsed.kpiC.real) && parsed.kpiC.real.length === 12) {
          newData.kpiC.real = parsed.kpiC.real.map((v: any) => (v === null ? null : +v));
        }
      }

      // KPI Facas
      if (parsed.kpiF) {
        newData.kpiF = { ...newData.kpiF };
        if (parsed.kpiF.tot) {
          const t = parsed.kpiF.tot;
          newData.kpiF.tot = {
            venda: +(t.venda ?? newData.kpiF.tot.venda ?? 0),
            compr: +(t.compr ?? newData.kpiF.tot.compr ?? 0),
            rep: +(t.rep ?? newData.kpiF.tot.rep ?? 0),
            nao: +(t.nao ?? newData.kpiF.tot.nao ?? 0),
          };
        }
        if (Array.isArray(parsed.kpiF.devPrev) && parsed.kpiF.devPrev.length === 12) {
          newData.kpiF.devPrev = parsed.kpiF.devPrev.map((v: any) => (v === null ? null : +v));
        }
        if (Array.isArray(parsed.kpiF.devReal) && parsed.kpiF.devReal.length === 12) {
          newData.kpiF.devReal = parsed.kpiF.devReal.map((v: any) => (v === null ? null : +v));
        }
        if (Array.isArray(parsed.kpiF.prPrev) && parsed.kpiF.prPrev.length === 12) {
          newData.kpiF.prPrev = parsed.kpiF.prPrev.map((v: any) => (v === null ? null : +v));
        }
        if (Array.isArray(parsed.kpiF.prReal) && parsed.kpiF.prReal.length === 12) {
          newData.kpiF.prReal = parsed.kpiF.prReal.map((v: any) => (v === null ? null : +v));
        }
      }

      onApply(newData);
      setStatus("success");
      setErrorMsg("");

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setStatus("idle"), 3000);
    } catch (e) {
      setStatus("error");
      setErrorMsg("JSON inválido. Verifique arrays (12 meses).");
      console.error(e);
    }
  };

  return (
    <section id="json-editor">
      <Card className="card-gradient border-border shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-lg font-bold">
              Dados (cole JSON e clique "Aplicar dados")
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              Campos ausentes mantêm os valores atuais.
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={json}
            onChange={(e) => setJson(e.target.value)}
            className="min-h-[280px] font-mono text-sm bg-background"
            placeholder="Cole o JSON aqui..."
          />

          <div className="flex items-center gap-4 flex-wrap">
            <Button onClick={handleApply} className="gap-2">
              Aplicar dados
            </Button>

            {status === "success" && (
              <span className="flex items-center gap-1 text-sm text-green-500">
                <CheckCircle className="h-4 w-4" />
                Dados aplicados com sucesso!
              </span>
            )}

            {status === "error" && (
              <span className="flex items-center gap-1 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {errorMsg}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

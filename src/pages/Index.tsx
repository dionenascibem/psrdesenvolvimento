import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/dashboard/Header";
import { KPICards } from "@/components/dashboard/KPICards";
import { ProductsChart } from "@/components/dashboard/ProductsChart";
import { RevenueEvolution } from "@/components/dashboard/RevenueEvolution";
import { StatusDonuts } from "@/components/dashboard/StatusDonuts";
import { ConversionChart } from "@/components/dashboard/ConversionChart";
import { VendaCustoChart } from "@/components/dashboard/VendaCustoChart";
import { ClicheSection } from "@/components/dashboard/ClicheSection";
import { FacasSection } from "@/components/dashboard/FacasSection";
import { JsonEditor } from "@/components/dashboard/JsonEditor";
import { DEFAULT_DATA, type DashboardData } from "@/data/defaultData";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [data, setData] = useState<DashboardData>(DEFAULT_DATA);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleNavigate = (id: string) => {
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleDataApply = (newData: DashboardData) => {
    setData(newData);
  };

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await signOut();
    } finally {
      navigate("/auth", { replace: true });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-lg">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen" id="top">
      <Header onNavigate={handleNavigate}>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400 hidden sm:block">
            {user.email}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </Header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Top KPI Cards */}
        <KPICards data={data} />

        {/* Products Chart */}
        <ProductsChart data={data} />

        {/* Revenue Evolution */}
        <RevenueEvolution data={data} />

        {/* Status Donut Charts */}
        <StatusDonuts data={data} />

        {/* Conversion Chart */}
        <ConversionChart data={data} />

        {/* Venda x Custo de Clichês */}
        <VendaCustoChart data={data} />

        {/* Clichês Section */}
        <ClicheSection data={data} />

        {/* Facas Section */}
        <FacasSection data={data} />

        {/* JSON Editor */}
        <JsonEditor data={data} onApply={handleDataApply} />
      </main>
    </div>
  );
};

export default Index;

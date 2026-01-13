import { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { KPICards } from "@/components/dashboard/KPICards";
import { ProductsChart } from "@/components/dashboard/ProductsChart";
import { RevenueEvolution } from "@/components/dashboard/RevenueEvolution";
import { StatusDonuts } from "@/components/dashboard/StatusDonuts";
import { ConversionChart } from "@/components/dashboard/ConversionChart";
import { ClicheSection } from "@/components/dashboard/ClicheSection";
import { FacasSection } from "@/components/dashboard/FacasSection";
import { JsonEditor } from "@/components/dashboard/JsonEditor";
import { DEFAULT_DATA, type DashboardData } from "@/data/defaultData";

const Index = () => {
  const [data, setData] = useState<DashboardData>(DEFAULT_DATA);

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

  return (
    <div className="min-h-screen" id="top">
      <Header onNavigate={handleNavigate} />

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

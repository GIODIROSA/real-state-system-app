import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-slate-50">
      {/* 1. SIDEBAR FIJO */}
      <aside className="hidden md:block h-full fixed inset-y-0 left-0 z-10 w-64">
        <Sidebar />
      </aside>

      {/* 2. CONTENIDO PRINCIPAL (Desplazado a la derecha) */}
      <main className="flex-1 md:pl-64 flex flex-col h-full">
        <Header />
        
        {/* Área scrolleable del contenido */}
        <div className="flex-1 overflow-y-auto p-8 bg-brand-50">
          {children}
        </div>
      </main>
    </div>
  );
}
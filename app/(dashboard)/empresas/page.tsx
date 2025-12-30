"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

// Imports propios
import { companyService } from "@/services/company.service"; // ✅ Usamos el intermediario
import { Company, CompanyFilters } from "@/types/company.types";
import { CompanyFiltersBar } from "@/components/companies/company-filters";
import { CompanyTable } from "@/components/companies/company-table";
import { Button } from "@/components/ui/button"; // Asumo que tienes tu UI kit

export default function CompaniesPage() {
  // Estados
  const [data, setData] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  
  // Estado de Filtros (Inicial)
  const [filters, setFilters] = useState<CompanyFilters>({
    search: "",
    status: "ALL",
    page: 1,
    limit: 5, // Requerimiento estricto: 5 por página
  });

  // Efecto para cargar datos cuando cambian los filtros
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const response = await companyService.getCompanies(filters);
        setData(response.data);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Error cargando empresas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [filters]); // Se ejecuta cada vez que 'filters' cambia

  // Handler para actualizar filtros
  const handleFilterChange = (newFilters: Partial<CompanyFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Handler para paginación
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      handleFilterChange({ page: newPage });
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. Header & Breadcrumbs (Visual) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Empresas</h1>
          <p className="text-gray-500 text-sm">Gestión de empresas inmobiliarias</p>
        </div>
        
        {/* Botón de Acción Principal */}
        <Link href="/dashboard/empresas/nueva">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> Agregar empresa
          </Button>
        </Link>
      </div>

      {/* 2. Barra de Filtros */}
      <CompanyFiltersBar 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />

      {/* 3. Título de Sección Tabla */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Listado de empresas</h2>
      </div>

      {/* 4. Tabla de Datos */}
      <CompanyTable 
        data={data} 
        loading={loading} 
      />

      {/* 5. Paginador (Simple) */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page === 1}
          >
            Anterior
          </Button>
          <span className="text-sm text-gray-600 font-medium">
            Página {filters.page} de {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page === totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}
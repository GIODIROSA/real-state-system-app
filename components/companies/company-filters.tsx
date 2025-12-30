"use client";

import {Search} from "lucide-react";
import {CompanyFilters, ReportingStatus} from "@/types/company.types";

interface companyFiltersProps{
    filters: CompanyFilters;
    onFilterChange: (newFilters: Partial<CompanyFilters>) => void;
}


export function CompanyFiltersBar({filters, onFilterChange}: companyFiltersProps){
    return (
         <div className="bg-white p-4 rounded-lg border shadow-sm flex flex-col md:flex-row gap-4 mb-6">
      
      {/* Buscador */}
      <div className="flex-1 space-y-1">
        <label className="text-sm font-medium text-gray-700">Buscar empresa</label>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por razón social o RUT"
            className="w-full pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.search || ""}
            onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })} // Reset página al filtrar
          />
        </div>
      </div>

      {/* Filtro por Estado */}
      <div className="w-full md:w-64 space-y-1">
        <label className="text-sm font-medium text-gray-700">Filtrar por estado</label>
        <select
          className="w-full py-2 px-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          value={filters.status || "ALL"}
          onChange={(e) => onFilterChange({ status: e.target.value as ReportingStatus | "ALL", page: 1 })}
        >
          <option value="ALL">Todos los estados</option>
          <option value="Informado">Informado</option>
          <option value="No Informado">No Informado</option>
        </select>
      </div>
    </div>    
    )
};
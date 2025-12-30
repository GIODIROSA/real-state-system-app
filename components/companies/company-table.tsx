"use client";

import { Company } from "@/types/company.types";
import { Loader2 } from "lucide-react";
import { StatusBadge } from "./status-badge";
import Link from "next/link";
import { Button } from "@/components/ui/button"; 

interface CompanyTableProps {
  data: Company[];
  loading: boolean;
}

export function CompanyTable({ data, loading }: CompanyTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white border rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white border rounded-lg text-gray-500">
        <p>No se encontraron empresas con los filtros seleccionados.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 border-b text-gray-500 uppercase text-xs font-medium">
          <tr>
            <th className="px-6 py-3 w-1/3">Empresa</th>
            <th className="px-6 py-3">RUT</th>
            <th className="px-6 py-3">Proyectos en Sede</th>
            <th className="px-6 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((company) => (
            <tr key={company.rut} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex flex-col items-start gap-1">
                  {/* Badge arriba del nombre según diseño */}
                  <StatusBadge status={company.status} />
                  <span className="font-medium text-gray-900 mt-1">
                    {company.businessName}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                {company.rut}
              </td>
              <td className="px-6 py-4 font-medium text-gray-900">
                {company.projectsCount}
              </td>
              <td className="px-6 py-4 text-right">
                <Link href={`/dashboard/empresas/${company.rut}`}>
                  <Button variant="outlineSecondary" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                    Revisar
                  </Button>
                </Link> 
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
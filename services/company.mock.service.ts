import { Company, CompanyFilters, PaginatedResponse } from "@/types/company.types";
import { MOCK_COMPANIES_DB } from "@/data/mock/companies.data";

// Función auxiliar para simular el tiempo de respuesta del servidor (Network Delay)
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const companyService = {

  /**
   * Obtiene el listado de empresas aplicando filtros, ordenamiento y paginación.
   * Simula la query compleja que realizará el Backend.
   */
  async getCompanies(filters: CompanyFilters): Promise<PaginatedResponse<Company>> {
    // 1. Simulamos latencia de red (600ms) para probar estados de carga (Loading)
    await wait(600);

    // Trabajamos sobre una copia del array para no mutar la "Base de Datos" original en memoria
    let filtered = [...MOCK_COMPANIES_DB];

    // ---------------------------------------------------------
    // A. FILTRADO (Simula cláusulas WHERE de SQL)
    // ---------------------------------------------------------
    filtered = filtered.filter((company) => {
      // 1. Filtro por Sede (RegionId)
      // Simulación: Asumimos que el usuario logueado pertenece a la Región "13" (Santiago).
      // Cuando tengas el backend real, esto se filtrará por el token del usuario.
      if (company.regionId !== "13") return false;

      // 2. Filtro de Búsqueda (Buscador general)
      if (filters.search) {
        const term = filters.search.toLowerCase();
        // Buscamos coincidencia parcial en Razón Social O en RUT
        const matchName = company.businessName.toLowerCase().includes(term);
        const matchRut = company.rut.toLowerCase().includes(term);
        
        if (!matchName && !matchRut) return false;
      }

      // 3. Filtro por Estado (Dropdown)
      // Si el filtro no es "ALL", debe coincidir exactamente con el estado
      if (filters.status && filters.status !== "ALL") {
        if (company.status !== filters.status) return false;
      }

      return true;
    });

    // ---------------------------------------------------------
    // B. ORDENAMIENTO (Simula cláusulas ORDER BY de SQL)
    // Regla de Negocio:
    // 1. Primero las empresas "Informado".
    // 2. Luego las empresas "No Informado".
    // 3. Dentro de cada grupo, orden alfabético por Razón Social.
    // ---------------------------------------------------------
    filtered.sort((a, b) => {
      // Prioridad 1: Estado
      if (a.status === "Informado" && b.status === "No Informado") return -1;
      if (a.status === "No Informado" && b.status === "Informado") return 1;

      // Prioridad 2: Alfabético (A-Z)
      return a.businessName.localeCompare(b.businessName);
    });

    // ---------------------------------------------------------
    // C. PAGINACIÓN (Simula LIMIT y OFFSET de SQL)
    // ---------------------------------------------------------
    const total = filtered.length;
    
    // Calculamos índices de corte
    const start = (filters.page - 1) * filters.limit;
    const end = start + filters.limit;
    
    // Obtenemos solo el segmento necesario para la página actual
    const data = filtered.slice(start, end);

    // Retornamos la estructura estandarizada que espera el Frontend
    return {
      data,
      total,
      page: filters.page,
      totalPages: Math.ceil(total / filters.limit),
    };
  },

  /**
   * Crea una nueva empresa.
   * Simula el endpoint POST /companies
   */
  async createCompany(payload: Partial<Company>): Promise<boolean> {
    await wait(1000); // Simulamos un proceso de escritura un poco más lento

    // Construimos el objeto final con valores por defecto para una empresa nueva
    const newCompany: Company = {
      rut: payload.rut || "SIN-RUT",
      businessName: payload.businessName || "Sin Razón Social",
      website: payload.website || "",
      comments: payload.comments || "",
      isCchcPartner: false,   // Por defecto no es socio al crearla manualmente (según regla supuesta)
      projectsCount: 0,       // Una empresa nueva nace sin proyectos
      status: "No Informado", // Una empresa nueva nace sin reportes
      regionId: "13",         // Asignamos a la región del usuario actual
    };

    // "Insertamos" al principio del array simulado
    MOCK_COMPANIES_DB.unshift(newCompany);

    return true;
  },

  /**
   * Elimina una empresa por RUT.
   * Simula el endpoint DELETE /companies/:rut
   * Incluye validación de reglas de negocio críticas.
   */
  async deleteCompany(rut: string): Promise<{ success: boolean; message: string }> {
    await wait(500);

    const index = MOCK_COMPANIES_DB.findIndex((c) => c.rut === rut);

    if (index === -1) {
      return { success: false, message: "La empresa no existe." };
    }

    const company = MOCK_COMPANIES_DB[index];

    // ---------------------------------------------------------
    // VALIDACIÓN DE REGLA DE NEGOCIO
    // "Solo aquellas empresas sin proyectos agregados... podrán ser eliminadas"
    // ---------------------------------------------------------
    if (company.projectsCount > 0) {
      return { 
        success: false, 
        message: "No se puede eliminar la empresa porque tiene proyectos asociados." 
      };
    }

    // Si pasa la validación, procedemos a eliminar
    MOCK_COMPANIES_DB.splice(index, 1);
    
    return { success: true, message: "Empresa eliminada correctamente." };
  }
};
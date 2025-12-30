// Estados
export type ReportingStatus = "Informado" | "No Informado";

export interface Company {
  rut: string;
  businessName: string;
  website: string;
  comments: string;
  isCchcPartner: boolean;

  projectsCount: number;
  status: ReportingStatus;
  regionId: string;
}

export interface CompanyFilters {
  search?: string;
  status?: ReportingStatus | "ALL";
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

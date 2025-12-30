import { ReportingStatus } from "@/types/company.types";

interface StatusBadgeProps {
  status: ReportingStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles =
    status === "Informado"
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-red-50 text-red-600 border-red-100";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium font-body border ${styles}`}
    >
      {status}
    </span>
  );
}

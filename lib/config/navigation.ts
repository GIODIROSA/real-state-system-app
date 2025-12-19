import {
  LayoutDashboard,
  Users,
  FileBarChart,
  Database,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { Permission } from "./permissions";

export interface NavItem {
  title: string;
  href: string;
  icon: any;
  permission?: Permission;
}

export const MAIN_NAV: NavItem[] = [
  {
    title: "Inicio",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Empresas",
    href: "/empresas",
    icon: Database,
    permission: "user:read",
  },
  {
    title: "Proyectos y Etapas",
    href: "/proyectos",
    icon: FileBarChart,
    permission: "user:read",
  },
  {
    title: "Mi perfil",
    href: "/mi-perfil",
    icon: FileBarChart,
    permission: "user:read",
  },
  {
    title: "Gestión de Usuarios",
    href: "/users",
    icon: Users,
    permission: "user:read",
  },
  {
    title: "Auditoría",
    href: "/auditoria",
    icon: ShieldCheck,
    permission: "audit:view",
  },
];

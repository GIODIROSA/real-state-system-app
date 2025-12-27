import { useAuth } from "./use-auth";
import { ROLE_PERMISSIONS, Permission } from "@/lib/config/permissions";

export function usePermissions() {
  const { user } = useAuth();

  const can = (requiredPermission: Permission): boolean => {
    if (!user) return false;

    if (user.permissions?.includes(requiredPermission as any)) return true;

    if (user.role && typeof user.role === "string") {
      if (ROLE_PERMISSIONS[user.role]?.includes(requiredPermission))
        return true;
    }

    if (user.roles && Array.isArray(user.roles)) {
      return user.roles.some((r) =>
        ROLE_PERMISSIONS[r.name]?.includes(requiredPermission)
      );
    }

    return false;
  };

  const canAny = (permissions: Permission[]) => permissions.some(can);

  return { can, canAny };
}

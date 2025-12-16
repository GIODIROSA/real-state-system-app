import { useAuth } from "./use-auth";
import { ROLE_PERMISSIONS, Permission } from "@/lib/config/permissions";

export function usePermissions() {
  const { user } = useAuth();

  const can = (requiredPermission: Permission): boolean => {
    if (!user) return false;

    if (user.permissions && Array.isArray(user.permissions)) {
      if (user.permissions.includes(requiredPermission as any)) {
        return true;
      }
    }

    if (user.role && typeof user.role === "string") {
      const mappedPermissions = ROLE_PERMISSIONS[user.role];
      if (mappedPermissions?.includes(requiredPermission)) {
        return true;
      }
    }

    if (user.roles && Array.isArray(user.roles)) {
      return user.roles.some((r) =>
        ROLE_PERMISSIONS[r.name]?.includes(requiredPermission)
      );
    }

    return false;
  };

  const canAny = (requiredPermissions: Permission[]): boolean => {
    if (!user) return false;
    return requiredPermissions.some((permission) => can(permission));
  };

  return { can, canAny };
}

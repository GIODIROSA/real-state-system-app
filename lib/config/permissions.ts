export type Permission =
    | "user:read"
    | "user:create"
    | "user:edit"
    | "user:delete"
    | "chamber:read"
    | "report:view";

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {

    // El SuperAdmin puede hacer todo
    SuperAdmin: ["user:read", "user:create", "user:edit", "user:delete", "chamber:read", "report:view"],

    //El Admin puede crear y editar
    Admin: ["user:read", "user:create", "user:edit", "chamber:read", "report:view"],

    //El Manager solo puedo leer y editar
    Manager: ["user:read", "user:edit", "chamber:read", "report:view"],

    // El User puede leer usuarios y ver cámaras
    User: ["user:read", "chamber:read"],

    Guest: []
};
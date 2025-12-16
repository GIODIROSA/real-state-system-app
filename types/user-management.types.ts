export interface Role {
    id: number;
    name: string;
    description: string;
    is_active: number;
}

export interface Chamber{
    id: number;
    name:string;
    region: string;
    location: string; 
    description?: string;
    is_active?: number;
}

export interface UserManagementItem{
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    account_status: "ACTIVE" | "BLOCKED" | "PENDING_CONFIRMATION" | "DISABLED" | "INACTIVE";
    roles: Role[];
    chambers: Chamber[];
    created_at: string;
}

// Payload para crear usuario
export interface CreateUserPayload{
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    profile_picture_url: string;
    role_ids: number[];
    chamber_ids: number[];
}

// Payload para Editar (update)
export interface UpdateUserPayload{
    id: number;
    email?:string;
    first_name?: string;
    last_name?: string;
    account_status?: string;
}
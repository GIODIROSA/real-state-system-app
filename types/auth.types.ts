import { User } from "./user.types";


// ==========================================
// 1. INPUTS (Datos que envías al backend)
// ==========================================

export interface LoginCredentials {
  email: string;
  password: string;
  rememberDevice?: boolean;
}

export interface TwoFactorPayload {
  // email?: string;
  code: string;
}

export interface ChangePasswordDTO {
  oldPassword: string;
  newPassword: string;
}


export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
}

// ==========================================
// 2. ESTRUCTURAS DE MFA 
// ==========================================

export interface MfaTokenData {
  expires_in: number;
  expires_at: string;
}

// ==========================================
// 3. RESPUESTAS DEL LOGIN 
// ==========================================


// caso A: Requiere MFA. 
export interface LoginResponseMfaRequired {
  success: true;
  requires_mfa: true; 
  mfa_pending: true;
  message: string;
  mfa_token: MfaTokenData;
  user?: never;
  token?: never;
}

// caso B: Login exitoso directo
export interface LoginResponseSuccess {
  success: true;
  requires_mfa: false;
  message: string;
  
  // Datos finales de sesión
  token: string;
  user: User;
  
  // No existen datos de pendiente
  mfa_pending?: false;
  mfa_token?: never;
}

// Tipo Principal para usar en auth.service.ts

export type LoginResponse = LoginResponseMfaRequired | LoginResponseSuccess;

// ==========================================
// 4. GENÉRICOS Y ERRORES 
// ==========================================

export interface LoginErrorDetails {
  failedAttempts: number;
  remainingAttempts: number;
  willBlockNext: boolean;
  blocked?: boolean;
  reason?: string;
}

export interface BackendErrorResponse{
  success: false;
  code: number;
  message: string;
  errors?: LoginErrorDetails | null;
}


// ****************************


// --- 5. RESPUESTAS GENERICAS ---

export interface PermissionsResponse {
  success: boolean;
  permissions: {
    id: number;
    name: string;
  }[];
}


export interface BackendResponse<T> {
  success: boolean;
  message: string;
  data: T;
  status?: number;
}


export interface UserPermissions {
  roles: string[];
  permissions: { id: number; name: string }[];
}





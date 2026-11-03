export type AccountType = "DOMESTIC" | "COMMERCIAL" | "BUSINESS";

export interface LoginInput {
  email: string;
  rawPassword: string;
  rememberMe?: boolean;
}

export interface RegisterInput {
  name: string;
  email: string;
  rawPassword: string;
  birthDate: string;
  accountType: AccountType;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  birthDate?: string;
  profilePictureUrl?: string;
  accountType: AccountType;
  planSelectionRequired?: boolean;
  pendingPlanTransactionId?: string;
}

export interface LoginResponseDto {
  user: AuthUser;
}

export interface RegisterResponseDto {
  id: string;
  name: string;
  accountType: AccountType;
  birthDate?: string;
  email: string;
}

export interface PasswordRecoveryRequest {
  email: string;
}

export interface VerifyPasswordRecoveryCodeRequest extends PasswordRecoveryRequest {
  code: string;
}

export interface ResetPasswordRequest extends VerifyPasswordRecoveryCodeRequest {
  newPassword: string;
}

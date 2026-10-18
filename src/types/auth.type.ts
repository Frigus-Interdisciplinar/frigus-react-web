export type AccountType = "DOMESTIC" | "COMMERCIAL" | "BUSINESS";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  birthDate: string;
  accountType: AccountType;
}

export interface LoginResponseDto {
  user: AuthUser;
}

export interface RegisterResponseDto {
  id: string;
  name: string;
  accountType: AccountType;
  birthDate: string;
  email: string;
}

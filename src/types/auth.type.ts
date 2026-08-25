export type AccountType = "DOMESTIC" | "COMMERCIAL" | "BUSINESS";

export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    birthDate: string;
    accountType: AccountType;
  };
}

export interface RegisterResponseDto {
  id: string;
  name: string;
  accountType: AccountType;
  birthDate: string;
  email: string;
}
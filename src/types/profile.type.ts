export interface ProfileUpdate {
  name?: string;
  birthDate?: string;
  profilePictureUrl?: string;
}

export interface ProfilePersonalData {
  name: string;
  birthDate: string;
}

export type ProfileFieldErrors = Partial<
  Record<keyof ProfilePersonalData, string>
>;

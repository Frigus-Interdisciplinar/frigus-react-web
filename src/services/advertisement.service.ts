import { api } from "@/utils/api.util";

export type AdvertisementStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "ARCHIVED";
export type Advertisement = {
  id: string;
  advertiserId: string;
  advertiserName: string;
  name: string;
  productName: string;
  category: string;
  description: string;
  imageUrl: string;
  destinationUrl?: string;
  price?: number;
  startDate?: string;
  endDate?: string;
  status: AdvertisementStatus;
  impressions: number;
  clicks: number;
  createdAt: string;
  updatedAt: string;
};
export type AdvertisementInput = Omit<Advertisement, "id" | "advertiserId" | "advertiserName" | "status" | "impressions" | "clicks" | "createdAt" | "updatedAt">;
export type AdvertisementPage = { content: Advertisement[]; totalElements: number; totalPages: number };

export async function listMyAdvertisements() {
  return api.get<AdvertisementPage>("/web/core/advertisements/mine?size=100");
}

export async function listActiveAdvertisements() {
  return api.get<AdvertisementPage>("/web/core/advertisements/active?size=20");
}

export function createAdvertisement(input: AdvertisementInput) {
  return api.post<Advertisement>("/web/core/advertisements", input);
}

export function updateAdvertisement(id: string, input: AdvertisementInput) {
  return api.put<Advertisement>(`/web/core/advertisements/${id}`, input);
}

export function updateAdvertisementStatus(id: string, status: Exclude<AdvertisementStatus, "DRAFT">) {
  return api.patch<Advertisement>(`/web/core/advertisements/${id}/status`, { status });
}

export function recordAdvertisementImpression(id: string) {
  return api.post<void>(`/web/core/advertisements/${id}/impressions`, undefined);
}

export function recordAdvertisementClick(id: string) {
  return api.post<void>(`/web/core/advertisements/${id}/clicks`, undefined);
}

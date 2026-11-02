export type AdvertisementStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "ARCHIVED";

export interface Advertisement {
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
}

export type AdvertisementInput = Omit<
  Advertisement,
  | "id"
  | "advertiserId"
  | "advertiserName"
  | "status"
  | "impressions"
  | "clicks"
  | "createdAt"
  | "updatedAt"
>;
export interface AdvertisementPage {
  content: Advertisement[];
  totalElements: number;
  totalPages: number;
}

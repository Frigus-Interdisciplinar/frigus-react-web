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

export interface AdvertisementAnalyticsCampaign {
  id: string;
  name: string;
  productName: string;
  category: string;
  status: AdvertisementStatus;
  startDate: string | null;
  endDate: string | null;
  cumulativeImpressions: number;
  cumulativeClicks: number;
  clickThroughRatePercent: number;
}

export interface MonthlyAdvertisementAnalytics {
  month: string;
  metricBasis: string;
  campaignCount: number;
  activeCampaignCount: number;
  cumulativeImpressions: number;
  cumulativeClicks: number;
  clickThroughRatePercent: number;
  campaigns: AdvertisementAnalyticsCampaign[];
}

export interface AdvertisementAudienceAnalytics {
  campaignCount: number;
  activeCampaignCount: number;
  cumulativeImpressions: number;
  cumulativeClicks: number;
  clickThroughRatePercent: number;
  categories: Array<{
    category: string;
    campaignCount: number;
    cumulativeImpressions: number;
    cumulativeClicks: number;
    impressionSharePercent: number;
  }>;
  campaigns: AdvertisementAnalyticsCampaign[];
}

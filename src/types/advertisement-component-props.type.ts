import type { Advertisement } from "@/types/advertisement.type";

export type AdvertisementShelfProps = {
  advertisements: Advertisement[];
  loading: boolean;
  error: string;
  onOfferClick?: (advertisementId: string) => void;
};

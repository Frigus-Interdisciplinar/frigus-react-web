import { api } from "@/utils/api.util";
import { serviceCall } from "@/utils/service.util";
import { validateForm } from "@/utils/validation.util";
import { advertisementInputSchema } from "@/schemas/advertisement.schema";
import {
  advertisementPageResponseSchema,
  advertisementResponseSchema,
} from "@/schemas/api-response.schema";
import type {
  Advertisement,
  AdvertisementInput,
  AdvertisementPage,
  AdvertisementStatus,
} from "@/types/advertisement.type";
export type {
  Advertisement,
  AdvertisementInput,
  AdvertisementPage,
  AdvertisementStatus,
} from "@/types/advertisement.type";

import type {
  AdvertisementAudienceAnalytics,
  MonthlyAdvertisementAnalytics,
} from "@/types/advertisement.type";
export type {
  AdvertisementAnalyticsCampaign,
  AdvertisementAudienceAnalytics,
  MonthlyAdvertisementAnalytics,
} from "@/types/advertisement.type";

export function getMonthlyAdvertisementAnalytics(month: string, signal?: AbortSignal): Promise<MonthlyAdvertisementAnalytics> {
  return serviceCall(() => api.get<MonthlyAdvertisementAnalytics>(
    `/web/core/advertisements/analytics/monthly?month=${encodeURIComponent(month)}`,
    { signal },
  ));
}

export function getAdvertisementAudienceAnalytics(signal?: AbortSignal): Promise<AdvertisementAudienceAnalytics> {
  return serviceCall(() => api.get<AdvertisementAudienceAnalytics>(
    "/web/core/advertisements/analytics/audience",
    { signal },
  ));
}

export function listMyAdvertisements(
  signal?: AbortSignal,
): Promise<AdvertisementPage> {
  return serviceCall(async () =>
    validateForm(
      advertisementPageResponseSchema,
      await api.get<unknown>("/web/core/advertisements/mine?size=100", {
        signal,
      }),
    ),
  );
}

export function listActiveAdvertisements(
  signal?: AbortSignal,
): Promise<AdvertisementPage> {
  return serviceCall(async () =>
    validateForm(
      advertisementPageResponseSchema,
      await api.get<unknown>("/web/core/advertisements/active?size=20", {
        signal,
      }),
    ),
  );
}

export function createAdvertisement(
  input: AdvertisementInput,
): Promise<Advertisement> {
  const validatedInput = validateForm(advertisementInputSchema, input);
  return serviceCall(async () =>
    validateForm(
      advertisementResponseSchema,
      await api.post<unknown>("/web/core/advertisements", validatedInput),
    ),
  );
}

export function updateAdvertisement(
  id: string,
  input: AdvertisementInput,
): Promise<Advertisement> {
  const validatedInput = validateForm(advertisementInputSchema, input);
  return serviceCall(async () =>
    validateForm(
      advertisementResponseSchema,
      await api.put<unknown>(
        `/web/core/advertisements/${encodeURIComponent(id)}`,
        validatedInput,
      ),
    ),
  );
}

export function updateAdvertisementStatus(
  id: string,
  status: Exclude<AdvertisementStatus, "DRAFT">,
): Promise<Advertisement> {
  return serviceCall(async () =>
    validateForm(
      advertisementResponseSchema,
      await api.patch<unknown>(
        `/web/core/advertisements/${encodeURIComponent(id)}/status`,
        { status },
      ),
    ),
  );
}

export function recordAdvertisementImpression(id: string): Promise<void> {
  return serviceCall(() =>
    api.post<void>(
      `/web/core/advertisements/${encodeURIComponent(id)}/impressions`,
      undefined,
    ),
  );
}

export function recordAdvertisementClick(id: string): Promise<void> {
  return serviceCall(() =>
    api.post<void>(
      `/web/core/advertisements/${encodeURIComponent(id)}/clicks`,
      undefined,
    ),
  );
}

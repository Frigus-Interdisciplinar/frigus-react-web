import type { LoginInput, RegisterInput } from "@/schemas/auth.schema";
import type { LoginResponseDto, RegisterResponseDto } from "@/types/auth.type";
import { api } from "@/utils/api.util";
import { serviceCall } from "@/utils/service.util";
import {
  loginSchema,
  googleLoginSchema,
  passwordRecoverySchema,
  recoveryCodeSchema,
  registerSchema,
  resetPasswordSchema,
} from "@/schemas/auth.schema";
import { sanitizeText, validateForm } from "@/utils/validation.util";
import {
  authUserResponseSchema,
  groupIdentityResponseSchema,
  inventoryContextResponseSchema,
  loginResponseSchema,
  registerResponseSchema,
} from "@/schemas/api-response.schema";
import { z } from "zod";

export interface PasswordRecoveryRequest {
  email: string;
}

export interface VerifyPasswordRecoveryCodeRequest extends PasswordRecoveryRequest {
  code: string;
}

export interface ResetPasswordRequest extends VerifyPasswordRecoveryCodeRequest {
  newPassword: string;
}

export function login(data: LoginInput): Promise<LoginResponseDto> {
  const sanitized = validateForm(loginSchema, {
    ...data,
    email: sanitizeText(data.email, 254).toLowerCase(),
  });
  return serviceCall(async () =>
    validateForm(
      loginResponseSchema,
      await api.post<unknown>("/web/auth/login", sanitized),
    ),
  );
}

export function loginWithGoogle(
  idToken: string,
  rememberMe: boolean,
): Promise<LoginResponseDto> {
  const payload = validateForm(googleLoginSchema, { idToken, rememberMe });
  return serviceCall(async () =>
    validateForm(
      loginResponseSchema,
      await api.post<unknown>("/web/auth/google", payload),
    ),
  );
}

export function register(data: RegisterInput): Promise<RegisterResponseDto> {
  const sanitized = validateForm(registerSchema, {
    ...data,
    name: sanitizeText(data.name),
    email: sanitizeText(data.email, 254).toLowerCase(),
  });
  return serviceCall(async () =>
    validateForm(
      registerResponseSchema,
      await api.post<unknown>("/web/auth/register", sanitized),
    ),
  );
}

export function refreshSession(
  signal?: AbortSignal,
): Promise<LoginResponseDto> {
  return serviceCall(async () =>
    validateForm(
      loginResponseSchema,
      await api.post<unknown>("/web/auth/refresh", {}, { signal }),
    ),
  );
}

export function logout(): Promise<void> {
  return serviceCall(() => api.post<void>("/web/auth/logout", {}));
}

export function getProfile(): Promise<LoginResponseDto["user"]> {
  return serviceCall(async () =>
    validateForm(
      authUserResponseSchema,
      await api.get<unknown>("/web/profile"),
    ),
  );
}

export function ensureStarterWorkspace(
  accountType: LoginResponseDto["user"]["accountType"],
  signal?: AbortSignal,
): Promise<{ id: string; name: string }> {
  return serviceCall(async () => {
    const groups = validateForm(
      z.array(groupIdentityResponseSchema),
      await api.get<unknown>("/web/core/groups", { signal }),
    );
    const labels = {
      DOMESTIC: "Minha casa",
      COMMERCIAL: "Meu estabelecimento",
      BUSINESS: "Minha empresa",
    };
    const group =
      groups[0] ??
      validateForm(
        groupIdentityResponseSchema,
        await api.post<unknown>(
          "/web/core/groups",
          { name: labels[accountType] },
          { signal },
        ),
      );
    const context = validateForm(
      inventoryContextResponseSchema,
      await api.get<unknown>(
        `/web/core/inventory/active-context?groupId=${encodeURIComponent(group.id)}`,
        { signal },
      ),
    );
    if (context.stocks.length === 0)
      await api.post<void>(
        "/web/core/inventory/stocks",
        {
          groupId: group.id,
          name: accountType === "DOMESTIC" ? "Despensa" : "Estoque principal",
        },
        { signal },
      );
    return group;
  });
}

export function requestPasswordRecovery(
  data: PasswordRecoveryRequest,
): Promise<void> {
  const validated = validateForm(passwordRecoverySchema, {
    ...data,
    email: sanitizeText(data.email, 254).toLowerCase(),
  });
  return serviceCall(() =>
    api.post<void>("/web/auth/forgot-password", validated),
  );
}

export function verifyPasswordRecoveryCode(
  data: VerifyPasswordRecoveryCodeRequest,
): Promise<void> {
  const validated = validateForm(recoveryCodeSchema, {
    ...data,
    email: sanitizeText(data.email, 254).toLowerCase(),
  });
  return serviceCall(() =>
    api.post<void>("/web/auth/verify-reset-code", validated),
  );
}

export function resetPassword(data: ResetPasswordRequest): Promise<void> {
  const validated = validateForm(resetPasswordSchema, {
    ...data,
    email: sanitizeText(data.email, 254).toLowerCase(),
  });
  return serviceCall(() =>
    api.post<void>("/web/auth/reset-password", validated),
  );
}

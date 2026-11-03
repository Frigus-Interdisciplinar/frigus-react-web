import type { LoginInput, RegisterInput } from "@/schemas/auth.schema";
import type {
  LoginResponseDto,
  PasswordRecoveryRequest,
  RegisterResponseDto,
  ResetPasswordRequest,
  VerifyPasswordRecoveryCodeRequest,
} from "@/types/auth.type";
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
  loginResponseSchema,
  registerResponseSchema,
} from "@/schemas/api-response.schema";

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

export function chooseOnboardingAccountType(
  accountType: LoginResponseDto["user"]["accountType"],
): Promise<LoginResponseDto["user"]> {
  return serviceCall(async () =>
    validateForm(
      authUserResponseSchema,
      await api.patch<unknown>("/web/profile/onboarding/account-type", {
        accountType,
      }),
    ),
  );
}

export function register(data: RegisterInput): Promise<RegisterResponseDto> {
  const sanitized = validateForm(registerSchema, {
    ...data,
    name: sanitizeText(data.name, 120),
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

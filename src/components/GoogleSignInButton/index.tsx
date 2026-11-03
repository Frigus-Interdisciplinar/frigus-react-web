import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/hooks/useTheme";

type GoogleCredentialResponse = { credential?: string };
type GoogleIdentityApi = {
  accounts: {
    id: {
      initialize: (options: {
        client_id: string;
        callback: (response: GoogleCredentialResponse) => void;
      }) => void;
      renderButton: (
        container: HTMLElement,
        options: {
          theme: "outline" | "outline_dark";
          size: "large";
          text: "signin_with";
          shape: "rectangular";
          width: number;
        },
      ) => void;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleIdentityApi;
  }
}

let googleScriptPromise: Promise<GoogleIdentityApi> | undefined;

function loadGoogleIdentity(): Promise<GoogleIdentityApi> {
  if (window.google?.accounts.id) return Promise.resolve(window.google);
  if (googleScriptPromise) return googleScriptPromise;

  googleScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google?.accounts.id) resolve(window.google);
      else reject(new Error("O login do Google não carregou corretamente."));
    };
    script.onerror = () => {
      googleScriptPromise = undefined;
      reject(new Error("Não foi possível carregar o login do Google."));
    };
    document.head.append(script);
  });

  return googleScriptPromise;
}

import type { GoogleSignInButtonProps } from "@/types/component-props.type";

export default function GoogleSignInButton({
  disabled = false,
  onCredential,
  onError,
}: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const credentialHandler = useRef(onCredential);
  const errorHandler = useRef(onError);
  const [loadError, setLoadError] = useState("");
  const [googleApi, setGoogleApi] = useState<GoogleIdentityApi | null>(null);
  const { theme } = useTheme();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() ?? "";

  useEffect(() => {
    credentialHandler.current = onCredential;
    errorHandler.current = onError;
  }, [onCredential, onError]);

  useEffect(() => {
    if (!clientId) return;
    let active = true;

    void loadGoogleIdentity()
      .then((google) => {
        if (!active) return;
        google.accounts.id.initialize({
          client_id: clientId,
          callback: ({ credential }) => {
            if (credential) credentialHandler.current(credential);
            else errorHandler.current("O Google não retornou uma credencial válida.");
          },
        });
        setGoogleApi(google);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        const message =
          reason instanceof Error
            ? reason.message
            : "Não foi possível carregar o login do Google.";
        setLoadError(message);
      });

    return () => {
      active = false;
    };
  }, [clientId]);

  useEffect(() => {
    const container = containerRef.current;
    if (!googleApi || !container) return;

    container.replaceChildren();
    googleApi.accounts.id.renderButton(container, {
      theme: theme === "dark" ? "outline_dark" : "outline",
      size: "large",
      text: "signin_with",
      shape: "rectangular",
      width: Math.max(200, Math.min(400, container.clientWidth)),
    });

    return () => container.replaceChildren();
  }, [googleApi, theme]);

  if (!clientId) {
    return (
      <p className="text-center text-xs text-gray-500 dark:text-gray-400">
        Login com Google indisponível: configure `VITE_GOOGLE_CLIENT_ID`.
      </p>
    );
  }

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        aria-label="Entrar com Google"
        aria-disabled={disabled}
        className={`mx-auto flex w-full max-w-[400px] justify-center overflow-hidden rounded-md focus-within:ring-2 focus-within:ring-inset focus-within:ring-frigus-primary ${disabled ? "pointer-events-none opacity-60" : ""}`}
      />
      {loadError && (
        <p role="alert" className="mt-2 text-center text-xs text-red-600">
          {loadError}
        </p>
      )}
    </div>
  );
}

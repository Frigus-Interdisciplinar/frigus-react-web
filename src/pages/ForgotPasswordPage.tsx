import { useEffect, useState, type FormEvent } from "react";
import AuthLayout from "@/components/AuthLayout";
import {
  CodeStep,
  CompleteStep,
  EmailStep,
  PasswordStep,
} from "@/components/PasswordRecoverySteps";
import { registerSchema } from "@/schemas/auth.schema";
import {
  requestPasswordRecovery,
  resetPassword,
  verifyPasswordRecoveryCode,
} from "@/services/password-recovery.service";

const RESEND_COOLDOWN_SECONDS = 60;

type RecoveryStep = "email" | "code" | "password" | "done";

const layoutContent = {
  email: {
    title: "Recupere o acesso\ncom segurança",
    description: "Vamos ajudar você a criar uma nova senha para sua conta.",
    cardTitle: "Código de segurança",
    cardDescription: "O código enviado por e-mail expira em 10 minutos.",
  },
  code: {
    title: "Só mais um passo\npara recuperar o acesso",
    description: "Confirme sua identidade com o código enviado por e-mail.",
    cardTitle: "Não recebeu o código?",
    cardDescription: "Confira a caixa de spam ou solicite um novo código após o intervalo indicado.",
  },
  password: {
    title: "Defina uma senha\nnova e segura",
    description: "Escolha uma senha forte para voltar a usar sua conta.",
    cardTitle: "Sua conta protegida",
    cardDescription: "Use uma senha exclusiva que você ainda não compartilhou com ninguém.",
  },
  done: {
    title: "Acesso recuperado\ncom segurança",
    description: "Sua senha foi atualizada e já pode ser usada no login.",
    cardTitle: "Tudo certo por aqui",
    cardDescription: "Entre novamente com sua nova senha para continuar.",
  },
} satisfies Record<RecoveryStep, {
  title: string;
  description: string;
  cardTitle: string;
  cardDescription: string;
}>;

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<RecoveryStep>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (resendSeconds === 0) return;

    const timer = window.setTimeout(
      () => setResendSeconds((seconds) => seconds - 1),
      1000,
    );
    return () => window.clearTimeout(timer);
  }, [resendSeconds]);

  async function handleRequestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");

    try {
      await requestPasswordRecovery(email);
      setResendSeconds(RESEND_COOLDOWN_SECONDS);
      setStep("code");
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Não foi possível enviar o código."));
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await verifyPasswordRecoveryCode({ email, code });
      setStep("password");
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Confira o código e tente novamente."));
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const passwordResult = registerSchema.shape.rawPassword.safeParse(password);
    if (!passwordResult.success) {
      setError(passwordResult.error.issues[0]?.message ?? "A senha informada é inválida.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ email, code, newPassword: password });
      setStep("done");
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Não foi possível redefinir sua senha."));
    } finally {
      setLoading(false);
    }
  }

  async function handleResendCode() {
    if (resendSeconds > 0 || loading) return;

    setLoading(true);
    setError("");
    setNotice("");

    try {
      await requestPasswordRecovery(email);
      setResendSeconds(RESEND_COOLDOWN_SECONDS);
      setNotice("Se existir uma conta com esse e-mail, enviaremos um novo código.");
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Não foi possível reenviar o código."));
    } finally {
      setLoading(false);
    }
  }

  function handleChangeEmail() {
    setStep("email");
    setCode("");
    setError("");
    setNotice("");
  }

  return (
    <AuthLayout {...layoutContent[step]}>
      <section className="w-full max-w-[576px] rounded-frigus bg-frigus-white p-7 shadow-[0_16px_34px_0_rgba(19,28,85,0.10)] sm:p-12">
        {step === "email" && (
          <EmailStep
            email={email}
            error={error}
            loading={loading}
            onEmailChange={setEmail}
            onSubmit={handleRequestCode}
          />
        )}

        {step === "code" && (
          <CodeStep
            code={code}
            email={email}
            error={error}
            loading={loading}
            notice={notice}
            resendSeconds={resendSeconds}
            onBack={handleChangeEmail}
            onCodeChange={setCode}
            onResend={handleResendCode}
            onSubmit={handleVerifyCode}
          />
        )}

        {step === "password" && (
          <PasswordStep
            confirmPassword={confirmPassword}
            error={error}
            loading={loading}
            password={password}
            onConfirmPasswordChange={setConfirmPassword}
            onPasswordChange={setPassword}
            onSubmit={handleResetPassword}
          />
        )}

        {step === "done" && <CompleteStep />}
      </section>
    </AuthLayout>
  );
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

import { useState, type FormEvent } from "react";
import { Link, Navigate, useSearchParams, useNavigate } from "react-router-dom";
import { CreditCard, QrCode, FileText } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import ThemeToggle from "@/components/ThemeToggle";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Checkbox from "@/components/Checkbox";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAbortableAsync } from "@/hooks/useAbortableAsync";
import { useLatestRequest } from "@/hooks/useLatestRequest";
import { useStore } from "@/store/store";
import { listPlans } from "@/services/plan.service";
import { createCheckoutTransaction } from "@/services/transaction.service";
import { checkoutSchema, type CheckoutInput } from "@/schemas/checkout.schema";
import {
  formatPlanPrice,
  getPlansPath,
  getSessionDestination,
  isPlanAvailableForAccount,
  resolveCheckoutPlanCode,
} from "@/utils/plan.util";

const paymentMethods = [
  { value: "card", label: "Cartão", Icon: CreditCard },
  { value: "pix", label: "Pix", Icon: QrCode },
  { value: "boleto", label: "Boleto", Icon: FileText },
] as const;

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const user = useStore((state) => state.user);
  const saveUser = useStore((state) => state.login);
  const planCode = resolveCheckoutPlanCode(searchParams.get("plan"));
  const {
    data: catalog,
    loading: loadingPlans,
    error: catalogError,
  } = useAbortableAsync(listPlans);
  const plan = catalog?.find(
    (candidate) =>
      candidate.planCode === planCode &&
      candidate.active &&
      candidate.price > 0 &&
      user &&
      isPlanAvailableForAccount(candidate.planCode, user.accountType),
  );
  const [checkout, setCheckout] = useState<{
    paymentMethod: CheckoutInput["paymentMethod"];
    cardNumber: string;
    acceptTerms: boolean;
  }>({ paymentMethod: "card", cardNumber: "", acceptTerms: false });
  const [processing, setProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const beginRequest = useLatestRequest();
  const navigate = useNavigate();

  const handleCheckout = async (event: FormEvent) => {
    event.preventDefault();
    if (!plan || processing) return;
    setCheckoutError("");
    const validation = checkoutSchema.safeParse({
      ...checkout,
      planCode: plan.planCode,
    });
    if (!validation.success) {
      setCheckoutError(
        validation.error.issues[0]?.message ?? "Revise os dados do pagamento.",
      );
      return;
    }
    const signal = beginRequest();
    setProcessing(true);
    try {
      const transaction = await createCheckoutTransaction(
        {
          planCode: plan.planCode,
          paymentMethod:
            checkout.paymentMethod === "card"
              ? "CREDIT_CARD"
              : checkout.paymentMethod === "pix"
                ? "PIX"
                : "BOLETO",
          ...(checkout.paymentMethod === "card"
            ? { fakeCardLast4: checkout.cardNumber }
            : {}),
          ...(checkout.paymentMethod === "pix"
            ? { fakePixKey: `frigus-${crypto.randomUUID()}` }
            : {}),
        },
        signal,
      );
      if (!signal.aborted) {
        if (user?.planSelectionRequired)
          saveUser({ ...user, pendingPlanTransactionId: transaction.id });
        navigate(
          `/checkout/webview/success?transactionId=${encodeURIComponent(transaction.id)}`,
          { replace: true },
        );
      }
    } catch (reason) {
      if (!signal.aborted)
        setCheckoutError(
          reason instanceof Error
            ? reason.message
            : "Não foi possível iniciar o pagamento. Tente novamente.",
        );
    } finally {
      if (!signal.aborted) setProcessing(false);
    }
  };

  if (!user) return null;
  if (user.planSelectionRequired && user.pendingPlanTransactionId)
    return <Navigate to={getSessionDestination(user)} replace />;
  const plansPath = getPlansPath(user.accountType);

  return (
    <AuthLayout
      title={"Falta pouco\npara começar"}
      description="Confirme o plano e escolha como pagar para concluir sua assinatura."
      cardTitle={plan?.name ?? "Seu plano Frigus"}
      cardDescription={
        plan?.description ??
        "O plano só será ativado após a confirmação do pagamento."
      }
    >
      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>
      <section
        aria-label="Finalizar pagamento"
        className="w-full max-w-[576px] py-12"
      >
        <div className="rounded-xl border border-[#C9DEF9] bg-white p-6 shadow-sm dark:border-[#34383E] dark:bg-[#1B1D20] sm:p-9">
          <h1 className="font-display text-2xl font-bold text-frigus-navy dark:text-white">
            Finalizar pagamento
          </h1>
          {loadingPlans ? (
            <LoadingSpinner
              label="Carregando o plano escolhido…"
              className="min-h-48"
            />
          ) : !plan ? (
            <div className="mt-5 space-y-4">
              <p
                role="alert"
                className="text-sm text-red-700 dark:text-red-300"
              >
                {catalogError ||
                  "Este plano não está disponível para sua conta. Volte e escolha um plano."}
              </p>
              <Link
                to={plansPath}
                className="inline-flex min-h-11 items-center font-semibold text-frigus-primary underline dark:text-[#A7BCFF]"
              >
                Voltar aos planos
              </Link>
            </div>
          ) : (
            <>
              <div className="my-5 rounded-xl bg-[#F5F8FC] p-4 dark:bg-[#252A32]">
                <h2 className="font-bold text-frigus-navy dark:text-white">
                  {plan.name}
                </h2>
                <p className="mt-1 text-lg font-semibold text-frigus-primary dark:text-[#A7BCFF]">
                  {formatPlanPrice(plan.price)}
                  {plan.billingInterval === "YEARLY"
                    ? "/ano"
                    : plan.billingInterval === "MONTHLY"
                      ? "/mês"
                      : ""}
                </p>
              </div>
              <p className="mb-5 rounded-md border border-amber-200 bg-amber-50 px-3.5 py-3 text-xs leading-relaxed text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                Ambiente de demonstração: nenhuma cobrança é feita. Use apenas
                os quatro dígitos de teste; nenhum dado real de cartão é
                solicitado.
              </p>
              <form
                onSubmit={(event) => void handleCheckout(event)}
                aria-busy={processing}
                className="space-y-5"
              >
                <fieldset disabled={processing} className="space-y-5">
                  <legend className="text-sm font-semibold text-frigus-navy dark:text-white">
                    Forma de pagamento
                  </legend>
                  <div className="grid grid-cols-3 gap-3 pt-3">
                    {paymentMethods.map(({ value, label, Icon }) => (
                      <label
                        key={value}
                        className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border p-3 text-sm font-semibold ${checkout.paymentMethod === value ? "border-frigus-primary bg-blue-50 text-frigus-primary dark:bg-blue-950/40 dark:text-[#A7BCFF]" : "border-gray-200 text-text-muted dark:border-gray-700"}`}
                      >
                        <Icon aria-hidden="true" className="size-5" />
                        <span>{label}</span>
                        <input
                          type="radio"
                          name="payment-method"
                          value={value}
                          checked={checkout.paymentMethod === value}
                          onChange={() =>
                            setCheckout((current) => ({
                              ...current,
                              paymentMethod: value,
                            }))
                          }
                          aria-label={label}
                          className="accent-frigus-primary"
                        />
                      </label>
                    ))}
                  </div>
                  {checkout.paymentMethod === "card" ? (
                    <Input
                      id="card-last-four"
                      label="Quatro dígitos de demonstração"
                      helperText="0000 simula um pagamento recusado."
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={4}
                      pattern="[0-9]{4}"
                      value={checkout.cardNumber}
                      onChange={(event) =>
                        setCheckout((current) => ({
                          ...current,
                          cardNumber: event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 4),
                        }))
                      }
                      required
                    />
                  ) : (
                    <p className="rounded-xl bg-[#F5F8FC] p-4 text-sm leading-6 text-text-muted dark:bg-[#252A32]">
                      {checkout.paymentMethod === "pix"
                        ? "O pagamento via Pix será simulado. Nenhum QR Code será emitido."
                        : "O pagamento via boleto será simulado. Nenhum boleto será emitido."}
                    </p>
                  )}
                  <Checkbox
                    id="terms-checkout"
                    checked={checkout.acceptTerms}
                    onChange={(event) =>
                      setCheckout((current) => ({
                        ...current,
                        acceptTerms: event.target.checked,
                      }))
                    }
                    label="Li e aceito os Termos de uso e a Política de privacidade."
                  />
                  <Button
                    type="submit"
                    disabled={
                      processing ||
                      !checkout.acceptTerms ||
                      (checkout.paymentMethod === "card" &&
                        checkout.cardNumber.length !== 4)
                    }
                    className="min-h-12 w-full font-bold"
                  >
                    {processing
                      ? "Enviando pagamento…"
                      : `Confirmar pagamento · ${formatPlanPrice(plan.price)}`}
                  </Button>
                </fieldset>
                {checkoutError && (
                  <p
                    role="alert"
                    className="text-sm text-red-700 dark:text-red-300"
                  >
                    {checkoutError}
                  </p>
                )}
              </form>
              <Link
                to={plansPath}
                className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-frigus-primary underline dark:text-[#A7BCFF]"
              >
                Voltar aos planos
              </Link>
            </>
          )}
        </div>
      </section>
    </AuthLayout>
  );
}

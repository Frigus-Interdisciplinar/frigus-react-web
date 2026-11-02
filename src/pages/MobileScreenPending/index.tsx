import { ArrowLeft, CircleHelp } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { pendingMobileScreenAliases } from "@/routes/mobile-aliases";

export default function MobileScreenPendingPage() {
  const [searchParams] = useSearchParams();
  const alias = searchParams.get("alias") ?? "";
  const title = pendingMobileScreenAliases[alias];

  if (!title) {
    return (
      <main
        id="main-content"
        tabIndex={-1}
        className="grid min-h-screen place-items-center bg-[#F5F8FC] p-6 text-center text-[#131C55]"
      >
        <section className="w-full max-w-md rounded-3xl border border-[#E1E7F0] bg-white p-8 shadow-sm">
          <h1 className="font-montserrat text-xl font-bold">
            Tela não encontrada
          </h1>
          <p className="mt-2 text-sm text-[#596B85]">
            O alias informado não corresponde a uma tela do protótipo.
          </p>
          <Link
            to="/home"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#2552C8] px-5 font-semibold text-white"
          >
            Voltar ao início
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="grid min-h-screen place-items-center bg-[#F5F8FC] p-4 text-[#131C55]"
    >
      <section
        className="w-full max-w-[420px] rounded-[28px] border border-[#E1E7F0] bg-white p-6 shadow-sm sm:p-8"
        aria-labelledby="pending-screen-title"
      >
        <Link
          to="/home"
          className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-[#2552C8] hover:bg-blue-50"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          Voltar ao início
        </Link>
        <div className="mt-8 flex size-12 items-center justify-center rounded-2xl bg-[#EAF3FF] text-[#2552C8]">
          <CircleHelp size={24} aria-hidden="true" />
        </div>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.12em] text-[#2552C8]">
          Protótipo Frigus
        </p>
        <h1
          id="pending-screen-title"
          className="mt-2 font-montserrat text-2xl font-bold"
        >
          {title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#596B85]">
          Esta tela ainda não está ligada ao fluxo do aplicativo. O alias foi
          mantido para acesso direto enquanto a tela e seus dados são
          implementados.
        </p>
        <p className="mt-5 rounded-2xl bg-[#F5F8FC] p-4 text-xs leading-5 text-[#596B85]">
          Alias: <code className="font-semibold text-[#131C55]">{alias}</code>
        </p>
      </section>
    </main>
  );
}

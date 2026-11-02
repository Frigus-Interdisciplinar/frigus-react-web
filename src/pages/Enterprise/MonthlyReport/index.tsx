import { Calendar } from "lucide-react";

export default function EnterpriseMonthlyReportPage() {
  return (
    <>
      <header>
        <h1 className="text-2xl font-bold font-montserrat text-[#141C55] dark:text-white">
          Relatório mensal
        </h1>
        <p className="mt-1 text-xs text-[#64748B] dark:text-neutral-400">
          Resumo dos resultados dos anúncios.
        </p>
      </header>

      <section
        role="status"
        className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-[#E1E7F0] bg-white p-8 text-center dark:border-[#343941] dark:bg-[#1C1E22]"
      >
        <Calendar className="mb-3 text-[#64748B] dark:text-neutral-400" size={28} />
        <h2 className="font-semibold text-[#141C55] dark:text-white">
          Nenhum relatório disponível
        </h2>
        <p className="mt-1 max-w-md text-sm text-[#64748B] dark:text-neutral-400">
          Não há dados reais para compor um relatório neste momento.
        </p>
      </section>
    </>
  );
}

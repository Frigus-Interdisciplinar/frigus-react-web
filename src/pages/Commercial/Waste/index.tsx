import LoadingSpinner from "@/components/LoadingSpinner";
import { useLatestRequest } from "@/hooks/useLatestRequest";
import { formatUnitOfMeasure } from "@/utils/unit.util";
import { useCallback, useEffect, useState } from "react";
import { AlertOctagon } from "lucide-react";
import { CommercialRegisterWasteModal } from "@/components/CommercialModals";
import type { StockProduct } from "@/types/inventory.type";

import type { Discard } from "@/types/commercial.type";
import { useServiceOperations } from "@/hooks/useServiceOperations";

export default function CommercialWastePage() {
  const apiOperations = useServiceOperations();
  const [isWasteModalOpen, setIsWasteModalOpen] = useState(false);
  const [products, setProducts] = useState<StockProduct[]>([]);
  const [discards, setDiscards] = useState<Discard[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");

  const beginRequest = useLatestRequest();
  const load = useCallback(async () => {
    const signal = beginRequest();
    try {
      const context = await apiOperations.inventory.getInventoryContext(signal);
      const [stockProducts, discards] = await Promise.all([
        Promise.all(context.stocks.map((stock) => apiOperations.inventory.listStockProducts(stock.id, signal))),
        apiOperations.discards.listDiscards(signal),
      ]);
      if (signal.aborted) return;
      setProducts(stockProducts.flat());
      setDiscards(discards);
      setError("");
    } catch {
      if (!signal.aborted) setError("Não foi possível carregar os descartes registrados.");
    } finally { if (!signal.aborted) setLoading(false); }
  }, [beginRequest, apiOperations.discards, apiOperations.inventory]);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, [load]);

  const recordDiscard = async (input: { stockProductId: number; quantity: number; reason: string }) => {
    await apiOperations.discards.createDiscard(input);
    await load();
    setFeedback("Perda registrada com sucesso.");
  };

  const productById = new Map(products.map((product) => [product.id, product]));
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthDiscards = discards.filter((item) => item.date.startsWith(currentMonth));
  const total = monthDiscards.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-montserrat text-[#141C55] dark:text-white">Desperdícios</h1>
            <p className="text-xs text-[#64748B] dark:text-neutral-400 mt-1">Registre descartes e consulte as perdas gravadas no estoque.</p>
          </div>
          <button type="button" disabled={products.length === 0} onClick={() => setIsWasteModalOpen(true)} aria-expanded={isWasteModalOpen} aria-haspopup="dialog" aria-controls="commercial-modal-dialog" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-colors">
            <AlertOctagon size={16} /> Registrar perda
          </button>
        </div>

        {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error} <button onClick={() => void load()} className="underline">Tentar novamente</button></p>}
        {feedback && <p role="status" aria-live="polite" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{feedback}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-[#1C1E22] p-5 rounded-2xl border border-[#e1e7f0] dark:border-[#343941] shadow-xs">
            <span className="text-xs font-medium text-[#64748B] dark:text-neutral-400">Unidades descartadas neste mês</span>
            <p className="text-2xl font-bold font-montserrat text-[#141C55] dark:text-white mt-1">{total}</p>
          </div>
          <div className="bg-white dark:bg-[#1C1E22] p-5 rounded-2xl border border-[#e1e7f0] dark:border-[#343941] shadow-xs">
            <span className="text-xs font-medium text-[#64748B] dark:text-neutral-400">Registros neste mês</span>
            <p className="text-2xl font-bold font-montserrat text-red-600 dark:text-red-400 mt-1">{monthDiscards.length}</p>
          </div>
        </div>

        <section className="bg-white dark:bg-[#1C1E22] rounded-3xl border border-[#e1e7f0] dark:border-[#343941] shadow-xs p-6">
          <h2 className="text-base font-bold font-montserrat text-[#141C55] dark:text-white">Descartes registrados</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead><tr className="border-b text-[10px] uppercase text-[#64748B]"><th className="py-3 px-2">Produto</th><th className="py-3 px-2">Quantidade</th><th className="py-3 px-2">Motivo</th><th className="py-3 px-2">Data</th></tr></thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#343941]">
                {!loading && discards.map((item) => {
                  const product = productById.get(item.stockProductId);
                  return <tr key={item.id}><td className="py-3 px-2 font-semibold text-[#141C55] dark:text-white">{product?.product?.name ?? `Lote #${item.stockProductId}`}</td><td className="py-3 px-2">{item.quantity} {formatUnitOfMeasure(product?.product?.unitOfMeasure)}</td><td className="py-3 px-2">{item.reason || "Não informado"}</td><td className="py-3 px-2">{new Date(item.date).toLocaleDateString("pt-BR")}</td></tr>;
                })}
                {loading && <tr><td colSpan={4} role="status" aria-live="polite" className="py-6 text-center text-gray-500"><LoadingSpinner label="Carregando descartes…" /></td></tr>}
                {!loading && discards.length === 0 && <tr><td colSpan={4} className="py-6 text-center text-gray-500">Nenhum descarte registrado.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <CommercialRegisterWasteModal isOpen={isWasteModalOpen} onClose={() => setIsWasteModalOpen(false)} products={products.map((item) => ({ id: item.id, name: item.product?.name ?? `Produto #${item.productId}`, quantity: item.quantity, unit: formatUnitOfMeasure(item.product?.unitOfMeasure) }))} onRecord={recordDiscard} />
    </>
  );
}

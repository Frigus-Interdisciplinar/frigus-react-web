import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowDownLeft, ArrowUpRight, Info } from "lucide-react";
import CommercialLayout from "@/components/CommercialLayout";
import { getStockProduct, recordMovement, updateStockProduct, type StockProduct } from "@/services/inventory.service";
import { api } from "@/utils/api.util";

type Movement = { id: number; movementType: string; quantity: number; date: string; userId?: string };
type Page<T> = { content?: T[] };

export default function CommercialBatchDetailsPage() {
  const { id } = useParams();
  const validId = id !== undefined && /^[1-9]\d*$/.test(id) && Number.isSafeInteger(Number(id));
  const [item, setItem] = useState<StockProduct>();
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [minimum, setMinimum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [movementType, setMovementType] = useState<"IN" | "OUT">("OUT");
  const [movementQuantity, setMovementQuantity] = useState("");

  const load = useCallback(async () => {
    if (!validId) { setError("Identificador do lote inválido."); setLoading(false); return; }
    setLoading(true); setError("");
    try {
      const stockProductId = Number(id);
      const [loaded, history] = await Promise.all([
        getStockProduct(stockProductId),
        api.get<Page<Movement>>(`/web/core/inventory/stock-products/${stockProductId}/movements?size=100`),
      ]);
      setItem(loaded); setMinimum(String(loaded.minimalQuantity ?? 0)); setExpiry(loaded.expireDate);
      setMovements(history.content ?? []);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Não foi possível carregar o lote."); }
    finally { setLoading(false); }
  }, [id, validId]);

  useEffect(() => { void load(); }, [load]);

  const saveBatch = async () => {
    if (!item) return;
    setSaving(true); setError("");
    try { await updateStockProduct(item.id, { minimalQuantity: Number(minimum), expireDate: expiry }); setEditing(false); await load(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Não foi possível atualizar o lote."); }
    finally { setSaving(false); }
  };

  const saveMovement = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!item || Number(movementQuantity) <= 0) return;
    setSaving(true); setError("");
    try { await recordMovement(item.id, movementType, Number(movementQuantity)); setMovementQuantity(""); await load(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Não foi possível registrar a movimentação."); }
    finally { setSaving(false); }
  };

  const product = item?.product;
  const daysToExpiry = item ? Math.ceil((new Date(`${item.expireDate}T00:00:00`).getTime() - new Date().setHours(0, 0, 0, 0)) / 86400000) : 0;
  const status = !item ? "" : daysToExpiry < 0 ? "Vencido" : daysToExpiry <= 2 ? "Vence em breve" : "Dentro do prazo";

  return (
    <CommercialLayout activeSection="stock" breadcrumb="Área comercial    /    Estoque">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-[#141C55] dark:text-white">Detalhes do lote</h1>
          <p className="text-xs text-[#64748B] dark:text-neutral-400 mt-1">Estoque / {product?.name ?? "Lote"} / #{id}</p>
        </div>
        <button type="button" onClick={() => setEditing((value) => !value)} className="rounded-xl bg-[#2552C8] px-4 py-2.5 text-xs font-semibold text-white">{editing ? "Cancelar edição" : "Editar lote"}</button>
      </div>
      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {loading ? <p className="py-8 text-center text-sm text-slate-500">Carregando lote…</p> : !item ? <p className="py-8 text-center text-sm text-slate-500">Lote não encontrado.</p> : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="space-y-6 rounded-3xl border border-[#e1e7f0] bg-white p-6 shadow-xs dark:border-[#343941] dark:bg-[#1C1E22]">
            <div><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#2552C8]">{product?.category ?? item.category}</span><h2 className="mt-3 text-xl font-bold text-[#141C55] dark:text-white">{product?.name ?? `Produto #${item.productId}`}</h2><p className="mt-1 text-xs text-slate-500">{product?.brand ?? ""}</p></div>
            <div className="border-t border-gray-100 pt-4 dark:border-[#343941]"><span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Quantidade disponível</span><p className="mt-1 text-3xl font-bold text-[#141C55] dark:text-white">{item.quantity} {product?.unitOfMeasure ?? "un"}</p><p className="mt-1 text-xs text-slate-500">Mínimo: {item.minimalQuantity ?? 0} {product?.unitOfMeasure ?? "un"}</p></div>
            {editing ? <div className="grid gap-3 sm:grid-cols-2"><label className="text-xs font-semibold">Estoque mínimo<input type="number" min="0" value={minimum} onChange={(event) => setMinimum(event.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" /></label><label className="text-xs font-semibold">Validade<input type="date" value={expiry} onChange={(event) => setExpiry(event.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" /></label><button type="button" disabled={saving || !expiry} onClick={() => void saveBatch()} className="rounded-xl bg-[#2552C8] px-4 py-2 text-xs font-semibold text-white disabled:opacity-50">Salvar</button></div> : <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 text-sm dark:border-[#343941]"><div><span className="text-[10px] font-bold uppercase text-slate-500">Código</span><p className="mt-1 font-semibold">#{item.id}</p></div><div><span className="text-[10px] font-bold uppercase text-slate-500">Local</span><p className="mt-1 font-semibold">{product?.storagePlace ?? "—"}</p></div><div><span className="text-[10px] font-bold uppercase text-slate-500">Validade</span><p className="mt-1 font-semibold">{new Date(`${item.expireDate}T00:00:00`).toLocaleDateString("pt-BR")}</p></div><div><span className="text-[10px] font-bold uppercase text-slate-500">Situação</span><p className="mt-1 font-semibold">{status}</p></div></div>}
            <form onSubmit={saveMovement} className="space-y-3 border-t border-gray-100 pt-4 dark:border-[#343941]"><h3 className="text-sm font-bold">Registrar movimentação</h3><div className="flex gap-2"><select value={movementType} onChange={(event) => setMovementType(event.target.value as "IN" | "OUT")} className="rounded-xl border px-3 py-2 text-sm"><option value="OUT">Saída</option><option value="IN">Entrada</option></select><input aria-label="Quantidade movimentada" type="number" min="0.01" step="any" value={movementQuantity} onChange={(event) => setMovementQuantity(event.target.value)} placeholder={`Quantidade (${product?.unitOfMeasure ?? "un"})`} className="min-w-0 flex-1 rounded-xl border px-3 py-2 text-sm" /><button disabled={saving || !movementQuantity} className="rounded-xl bg-[#2552C8] px-4 py-2 text-xs font-semibold text-white disabled:opacity-50">Registrar</button></div></form>
          </section>
          <section className="rounded-3xl border border-[#e1e7f0] bg-white p-6 shadow-xs dark:border-[#343941] dark:bg-[#1C1E22]"><h2 className="mb-6 text-base font-bold text-[#141C55] dark:text-white">Histórico de movimentações</h2>{movements.length ? <div className="space-y-5">{movements.map((movement) => { const incoming = movement.movementType === "IN"; return <div key={movement.id} className="flex items-center gap-3"><div className={`flex h-8 w-8 items-center justify-center rounded-full ${incoming ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>{incoming ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}</div><div className="flex-1"><p className="text-xs font-bold">{incoming ? "Entrada" : movement.movementType === "OUT" ? "Saída" : "Ajuste"}</p><p className="text-[11px] text-slate-500">{movement.date ? new Date(movement.date).toLocaleString("pt-BR") : ""}</p></div><span className={`text-xs font-bold ${incoming ? "text-emerald-600" : "text-red-600"}`}>{incoming ? "+" : "−"}{movement.quantity} {product?.unitOfMeasure ?? "un"}</span></div>; })}</div> : <p className="text-sm text-slate-500">Nenhuma movimentação registrada.</p>}<div className="mt-8 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900"><Info size={18} className="shrink-0" />Use primeiro o lote com vencimento mais próximo.</div></section>
        </div>
      )}
    </CommercialLayout>
  );
}

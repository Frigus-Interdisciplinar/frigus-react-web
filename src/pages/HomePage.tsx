import { useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import WorkspaceLayout from "@/components/WorkspaceLayout";
import { inventoryService } from "@/services/inventory.service";
import { notificationService } from "@/services/notification.service";

type Summary = Record<string, unknown>;
export default function HomePage() {
  const [summary, setSummary] = useState<Summary>({});
  const [stocks, setStocks] = useState<Array<{id:number;name:string}>>([]);
  const [unread, setUnread] = useState(0);
  const [error, setError] = useState("");
  useEffect(() => { Promise.all([inventoryService.getActiveContext(), inventoryService.getSummary(), notificationService.unreadCount()]).then(([context, totals, count]) => { setStocks(context.stocks); setSummary(totals); setUnread(count.count); }).catch((cause) => setError(cause instanceof Error ? cause.message : "Não foi possível carregar o resumo.")); }, []);
  const metrics: Array<[string,string]> = [["Produtos cadastrados", String(summary.productCount ?? "—")], ["Itens no estoque", String(summary.itemCount ?? "—")], ["Valor estimado", typeof summary.estimatedValue === "number" ? summary.estimatedValue.toLocaleString("pt-BR", {style:"currency",currency:"BRL"}) : "—"], ["Compras pendentes", String(summary.pendingShoppingItems ?? "—")]];
  return <RequireAuth><WorkspaceLayout activeSection="home" title="Visão geral" subtitle="Um resumo em tempo real do seu estoque e das suas rotinas.">
    {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-5 shadow-sm"><div><p className="text-xs font-semibold uppercase text-slate-400">Contexto ativo</p><p className="mt-1 text-lg font-bold">{stocks.length ? `${stocks.length} estoque(s)` : "Nenhum estoque disponível"}</p></div><a href="/settings" className="text-sm font-semibold text-frigus-primary underline">Preferências e notificações ({unread} não lidas)</a></div>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(([label,value]) => <article key={label} className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-3 text-2xl font-bold">{value}</p></article>)}</section>
    <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm"><h2 className="text-lg font-bold">Validade próxima</h2><div className="mt-3 divide-y divide-slate-100">{Array.isArray(summary.nearExpiration) && summary.nearExpiration.length ? (summary.nearExpiration as Array<Record<string,unknown>>).map((item,index) => <div key={String(item.id ?? index)} className="flex justify-between py-3 text-sm"><span>{String(item.productName ?? item.name ?? `Produto ${item.productId ?? ""}`)}</span><span className="text-slate-500">{String(item.expireDate ?? "")}</span></div>) : <p className="py-4 text-sm text-slate-500">Nenhum item próximo do vencimento.</p>}</div></section>
  </WorkspaceLayout></RequireAuth>;
}

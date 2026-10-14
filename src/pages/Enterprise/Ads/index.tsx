import { useEffect, useMemo, useState } from "react";
import { Archive, Megaphone, Pencil, Plus, Search } from "lucide-react";
import EnterpriseLayout from "@/components/EnterpriseLayout";
import { createAdvertisement, listMyAdvertisements, updateAdvertisement, updateAdvertisementStatus, type Advertisement, type AdvertisementInput, type AdvertisementStatus } from "@/services/advertisement.service";

const emptyForm = { name: "", productName: "", category: "", description: "", imageUrl: "", destinationUrl: "", price: "", startDate: "", endDate: "" };
const statusNames: Record<AdvertisementStatus, string> = { DRAFT: "Rascunho", ACTIVE: "Ativo", PAUSED: "Pausado", ARCHIVED: "Arquivado" };

export default function EnterpriseAdsPage() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<AdvertisementStatus | "ALL">("ALL");
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try { const page = await listMyAdvertisements(); setAds(page.content ?? []); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Não foi possível carregar os anúncios."); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => ads.filter((ad) => (filter === "ALL" || ad.status === filter) && `${ad.name} ${ad.productName} ${ad.category}`.toLowerCase().includes(search.toLowerCase())), [ads, filter, search]);
  const beginCreate = () => { setEditing(null); setForm(emptyForm); setFormOpen(true); };
  const beginEdit = (ad: Advertisement) => { setEditing(ad.id); setForm({ name: ad.name, productName: ad.productName, category: ad.category, description: ad.description, imageUrl: ad.imageUrl, destinationUrl: ad.destinationUrl ?? "", price: ad.price == null ? "" : String(ad.price), startDate: ad.startDate ?? "", endDate: ad.endDate ?? "" }); setFormOpen(true); };

  const save = async (event: React.FormEvent) => {
    event.preventDefault(); setSaving(true); setError("");
    const input: AdvertisementInput = { ...form, destinationUrl: form.destinationUrl || undefined, price: form.price ? Number(form.price) : undefined, startDate: form.startDate || undefined, endDate: form.endDate || undefined };
    try { if (editing) await updateAdvertisement(editing, input); else await createAdvertisement(input); setFormOpen(false); await load(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Não foi possível salvar o anúncio."); }
    finally { setSaving(false); }
  };

  const changeStatus = async (ad: Advertisement, status: Exclude<AdvertisementStatus, "DRAFT">) => {
    setError("");
    try { await updateAdvertisementStatus(ad.id, status); await load(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Não foi possível atualizar o anúncio."); }
  };

  const updateField = (key: keyof typeof emptyForm, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const count = (status: AdvertisementStatus) => ads.filter((ad) => ad.status === status).length;

  return (
    <EnterpriseLayout activeSection="ads" breadcrumb="Área empresarial    /    Produtos anunciados" onOpenCreateAd={beginCreate}>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div><h1 className="text-2xl font-bold font-montserrat text-[#141C55] dark:text-white">Produtos anunciados</h1><p className="mt-1 text-xs text-[#64748B] dark:text-neutral-400">Cadastre e controle os anúncios exibidos no app.</p></div>
        <button type="button" onClick={beginCreate} className="inline-flex items-center gap-2 rounded-xl bg-[#2552C8] px-4 py-2.5 text-xs font-semibold text-white"><Plus size={16} />Novo anúncio</button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {(["ALL", "ACTIVE", "PAUSED", "DRAFT"] as const).map((status) => <button key={status} type="button" onClick={() => setFilter(status)} className={`rounded-2xl border p-4 text-left shadow-xs ${filter === status ? "border-blue-400 bg-blue-50 dark:bg-blue-950/30" : "border-[#E1E7F0] bg-white dark:border-[#343941] dark:bg-[#1C1E22]"}`}><span className="flex items-center gap-2 text-xs font-semibold text-slate-500"><Megaphone size={15} />{status === "ALL" ? "Todos os anúncios" : statusNames[status]}</span><strong className="mt-2 block text-2xl text-[#141C55] dark:text-white">{status === "ALL" ? ads.length : count(status)}</strong></button>)}
      </div>

      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {formOpen && <form onSubmit={save} className="space-y-4 rounded-3xl border border-blue-100 bg-white p-5 shadow-xs dark:border-[#343941] dark:bg-[#1C1E22]"><div className="flex items-center justify-between"><h2 className="font-bold text-[#141C55] dark:text-white">{editing ? "Editar anúncio" : "Novo anúncio"}</h2><button type="button" onClick={() => setFormOpen(false)} className="text-xs text-slate-500">Fechar</button></div><div className="grid gap-3 sm:grid-cols-2"><label className="text-xs font-semibold">Nome do anúncio<input required maxLength={120} value={form.name} onChange={(e) => updateField("name", e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" /></label><label className="text-xs font-semibold">Produto<input required maxLength={160} value={form.productName} onChange={(e) => updateField("productName", e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" /></label><label className="text-xs font-semibold">Categoria<input required maxLength={80} value={form.category} onChange={(e) => updateField("category", e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" /></label><label className="text-xs font-semibold">Preço (opcional)<input type="number" min="0" step="0.01" value={form.price} onChange={(e) => updateField("price", e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" /></label><label className="text-xs font-semibold sm:col-span-2">Descrição<textarea required maxLength={2000} value={form.description} onChange={(e) => updateField("description", e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" rows={3} /></label><label className="text-xs font-semibold sm:col-span-2">Imagem pública (URL HTTPS)<input required type="url" pattern="https://.*" value={form.imageUrl} onChange={(e) => updateField("imageUrl", e.target.value)} placeholder="https://..." className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" /></label><label className="text-xs font-semibold sm:col-span-2">Link de destino (opcional, HTTPS)<input type="url" pattern="https://.*" value={form.destinationUrl} onChange={(e) => updateField("destinationUrl", e.target.value)} placeholder="https://..." className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" /></label><label className="text-xs font-semibold">Início (opcional)<input type="date" value={form.startDate} onChange={(e) => updateField("startDate", e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" /></label><label className="text-xs font-semibold">Fim (opcional)<input type="date" value={form.endDate} onChange={(e) => updateField("endDate", e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" /></label></div><p className="text-xs text-slate-500">O anúncio começa como rascunho. Você pode publicá-lo depois de salvar.</p><button disabled={saving} className="rounded-xl bg-[#2552C8] px-5 py-2.5 text-xs font-semibold text-white disabled:opacity-50">{saving ? "Salvando…" : "Salvar rascunho"}</button></form>}

      <section className="space-y-4 rounded-3xl border border-[#E1E7F0] bg-white p-5 shadow-xs dark:border-[#343941] dark:bg-[#1C1E22]"><div className="relative max-w-md"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar anúncio ou categoria" className="w-full rounded-xl border bg-slate-50 py-2.5 pl-9 pr-3 text-xs dark:border-[#343941] dark:bg-[#252A32]" /></div>
        {loading ? <p className="py-8 text-center text-sm text-slate-500">Carregando anúncios…</p> : !filtered.length ? <div className="py-8 text-center"><p className="text-sm font-semibold text-[#141C55] dark:text-white">Nenhum anúncio nesta lista</p><p className="mt-1 text-xs text-slate-500">Crie um rascunho para começar.</p></div> : <div className="divide-y divide-slate-100 dark:divide-[#343941]">{filtered.map((ad) => <article key={ad.id} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center"><img src={ad.imageUrl} alt="" className="h-20 w-24 rounded-xl bg-slate-100 object-cover" /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-[#141C55] dark:text-white">{ad.name}</h3><span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold dark:bg-[#252A32]">{statusNames[ad.status]}</span></div><p className="mt-1 text-xs text-slate-500">{ad.productName} · {ad.category}{ad.price == null ? "" : ` · ${ad.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`}</p><p className="mt-1 line-clamp-2 text-xs text-slate-500">{ad.description}</p><p className="mt-2 text-[11px] text-slate-500">{ad.impressions} impressões · {ad.clicks} cliques</p></div><div className="flex flex-wrap gap-2"><button type="button" disabled={ad.status === "ARCHIVED"} onClick={() => beginEdit(ad)} className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs disabled:opacity-50"><Pencil size={13} />Editar</button>{ad.status === "DRAFT" || ad.status === "PAUSED" ? <button type="button" onClick={() => void changeStatus(ad, "ACTIVE")} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white">Publicar</button> : ad.status === "ACTIVE" ? <button type="button" onClick={() => void changeStatus(ad, "PAUSED")} className="rounded-lg border px-3 py-2 text-xs">Pausar</button> : null}{ad.status !== "ARCHIVED" && <button type="button" onClick={() => void changeStatus(ad, "ARCHIVED")} aria-label="Arquivar anúncio" className="rounded-lg border px-3 py-2 text-slate-500"><Archive size={14} /></button>}</div></article>)}</div>}
      </section>
    </EnterpriseLayout>
  );
}

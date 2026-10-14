import { useEffect, useState } from "react";
import { api } from "@/utils/api.util";
import {
  Clock,
  ShoppingBasket,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import Badge from "@/components/Badge";

type NotificationItem = {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: "Estoque" | "Compras" | "Sistema";
  unread?: boolean;
};

type ApiNotification = { id: string; type: string; title: string; body: string; readAt: string | null; createdAt: string };
type Preferences = { expirationAlertsEnabled: boolean; lowStockAlertsEnabled: boolean; shoppingRemindersEnabled: boolean; weeklySummaryEnabled: boolean; theme: "LIGHT" | "DARK" | "SYSTEM" };

function mapNotification(item: ApiNotification): NotificationItem {
  const type = item.type.startsWith("SHOPPING_LIST") ? "Compras" : item.type === "WEEKLY_SUMMARY" || item.type === "AD_CLICK_MILESTONE" ? "Sistema" : "Estoque";
  const age = Math.max(0, Date.now() - new Date(item.createdAt).getTime());
  const mins = Math.floor(age / 60000);
  const time = mins < 60 ? `há ${mins} min` : mins < 1440 ? `há ${Math.floor(mins / 60)} h` : new Date(item.createdAt).toLocaleDateString("pt-BR");
  return { id: item.id, title: item.title, desc: item.body, time, type, unread: !item.readAt };
}

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"Todas" | "Estoque" | "Compras" | "Sistema">("Todas");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loadError, setLoadError] = useState("");
  const [preferences, setPreferences] = useState<Preferences>({ expirationAlertsEnabled: true, lowStockAlertsEnabled: true, shoppingRemindersEnabled: true, weeklySummaryEnabled: false, theme: "SYSTEM" });
  const [savingPreferences, setSavingPreferences] = useState(false);
  useEffect(() => {
    void api.get<{ content: ApiNotification[] }>("/web/core/notifications?page=0&size=50")
      .then((page) => setNotifications(page.content.map(mapNotification)))
      .catch((error: unknown) => setLoadError(error instanceof Error ? error.message : "Não foi possível carregar as notificações."));
    void api.get<Preferences>("/web/core/preferences").then(setPreferences)
      .catch((error: unknown) => setLoadError(error instanceof Error ? error.message : "Não foi possível carregar as preferências."));
  }, []);

  const savePreferences = async () => {
    setSavingPreferences(true);
    try { await api.put("/web/core/preferences", preferences); }
    catch (error) { setLoadError(error instanceof Error ? error.message : "Não foi possível salvar as preferências."); }
    finally { setSavingPreferences(false); }
  };

  const markAllRead = async () => {
    try {
      await api.patch<void>("/web/core/notifications/read-all", {});
      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Não foi possível marcar as notificações como lidas.");
    }
  };

  const markRead = async (id: string) => {
    try {
      await api.patch<void>(`/web/core/notifications/${id}/read`, {});
      setNotifications((prev) => prev.map((item) => item.id === id ? { ...item, unread: false } : item));
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Não foi possível atualizar a notificação.");
    }
  };

  const filteredNotifications = notifications.filter(
    (n) => filter === "Todas" || n.type === filter
  );

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <AppLayout activeSection="notifications">
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-frigus-navy dark:text-white">
                Notificações
              </h1>
              {unreadCount > 0 && (
                <Badge variant="accent">{unreadCount} novas</Badge>
              )}
            </div>
            <p className="text-gray-500 dark:text-neutral-400 text-sm mt-1 font-sans">
              Fique por dentro do que precisa da sua atenção
            </p>
          </div>

          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-[#343941] bg-white dark:bg-[#1C1E22] text-xs font-bold text-frigus-navy dark:text-white hover:bg-gray-50 dark:hover:bg-[#252A32] transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
          >
            <CheckCircle size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span>Marcar como lidas</span>
          </button>
        </div>

        {/* Abas de Filtros */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {(["Todas", "Estoque", "Compras", "Sistema"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === tab
                  ? "bg-frigus-primary dark:bg-blue-600 text-white shadow-xs"
                  : "bg-white dark:bg-[#1C1E22] text-gray-600 dark:text-neutral-300 border border-gray-200 dark:border-[#343941] hover:border-gray-300 dark:hover:border-neutral-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid: Feed de Notificações + Painel Lateral de Preferências */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Feed de Notificações (8 colunas) */}
          <div className="lg:col-span-8 bg-white dark:bg-[#1C1E22] rounded-3xl p-6 border border-gray-200/80 dark:border-[#343941] shadow-xs space-y-3">
            <h3 className="font-montserrat font-bold text-frigus-navy dark:text-white text-base mb-2">
              Recentes
            </h3>

            {loadError && <p role="alert" className="text-sm text-red-600">{loadError}</p>}
            <div className="divide-y divide-gray-100 dark:divide-[#343941]">
              {filteredNotifications.length === 0 && <p className="py-8 text-center text-sm text-gray-500">Nenhuma notificação para este filtro.</p>}
              {filteredNotifications.map((item) => (
                <button
                  type="button"
                  onClick={() => item.unread && void markRead(item.id)}
                  key={item.id}
                  className={`py-4 flex items-start gap-4 transition-colors rounded-xl px-2 ${
                    item.unread ? "bg-blue-50/30 dark:bg-blue-900/10" : ""
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                      item.type === "Estoque"
                        ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/40"
                        : item.type === "Compras"
                        ? "bg-blue-50 dark:bg-blue-950/40 text-frigus-primary dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40"
                        : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40"
                    }`}
                  >
                    {item.type === "Estoque" && <Clock size={18} />}
                    {item.type === "Compras" && <ShoppingBasket size={18} />}
                    {item.type === "Sistema" && <TrendingUp size={18} />}
                  </div>

                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-frigus-navy dark:text-white text-sm">
                        {item.title}
                      </h4>
                      <span className="text-[11px] text-gray-400 dark:text-neutral-400 font-medium">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-neutral-400 leading-relaxed font-sans">
                      {item.desc}
                    </p>
                  </div>

                  {item.unread && (
                    <div className="w-2 h-2 rounded-full bg-frigus-primary dark:bg-blue-500 shrink-0 mt-2" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Painel de Preferências (4 colunas) */}
          <div className="lg:col-span-4 bg-white dark:bg-[#1C1E22] rounded-3xl p-6 border border-gray-200/80 dark:border-[#343941] shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="font-montserrat font-bold text-frigus-navy dark:text-white text-base">
                  Preferências
                </h3>
                <p className="text-xs text-gray-400 dark:text-neutral-400 mt-0.5">
                  Escolha como deseja ser avisado.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {([
                  ["expirationAlertsEnabled", "Alertas de validade"],
                  ["lowStockAlertsEnabled", "Estoque baixo"],
                  ["shoppingRemindersEnabled", "Lembretes de compras"],
                  ["weeklySummaryEnabled", "Resumo semanal"],
                ] as const).map(([key, label]) => (
                  <label key={key} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-[#252A32] border border-gray-100 dark:border-[#343941]">
                    <span className="text-xs font-bold text-frigus-navy dark:text-white">{label}</span>
                    <input type="checkbox" checked={preferences[key]} onChange={(event) => setPreferences((current) => ({ ...current, [key]: event.target.checked }))} className="rounded text-frigus-primary focus:ring-frigus-primary" />
                  </label>
                ))}
              </div>
            </div>

            <button onClick={() => void savePreferences()} disabled={savingPreferences} className="w-full py-2.5 px-4 bg-gray-100 dark:bg-[#252A32] hover:bg-gray-200 dark:hover:bg-[#2e343e] text-frigus-navy dark:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-60">
              {savingPreferences ? "Salvando…" : "Salvar preferências"}
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

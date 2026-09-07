import { useState } from "react";
import {
  Clock,
  ShoppingBasket,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import AppLayout from "@/components/Layout/AppLayout";
import Badge from "@/components/Common/Badge";

type NotificationItem = {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: "Estoque" | "Compras" | "Sistema";
  unread?: boolean;
};

const initialNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "Tomates vencem amanhã",
    desc: "Use os tomates em uma receita ou adicione à lista de compras.",
    time: "há 12 min",
    type: "Estoque",
    unread: true,
  },
  {
    id: "2",
    title: "Marina atualizou a lista de compras",
    desc: "Foram adicionados leite integral e aveia.",
    time: "há 1 h",
    type: "Compras",
    unread: true,
  },
  {
    id: "3",
    title: "Azeite de oliva está com pouco estoque",
    desc: "Restam 120 ml na despensa.",
    time: "ontem",
    type: "Estoque",
    unread: true,
  },
  {
    id: "4",
    title: "Seu resumo mensal está pronto",
    desc: "Veja quanto sua casa evitou desperdiçar neste mês.",
    time: "terça-feira",
    type: "Sistema",
    unread: true,
  },
];

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"Todas" | "Estoque" | "Compras" | "Sistema">("Todas");
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [emailNotify, setEmailNotify] = useState(true);
  const [browserNotify, setBrowserNotify] = useState(false);
  const [onlyImportant, setOnlyImportant] = useState(true);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
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
              <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-frigus-navy">
                Notificações
              </h1>
              {unreadCount > 0 && (
                <Badge variant="accent">{unreadCount} novas</Badge>
              )}
            </div>
            <p className="text-gray-500 text-sm mt-1 font-sans">
              Fique por dentro do que precisa da sua atenção
            </p>
          </div>

          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-frigus-navy hover:bg-gray-50 transition-colors shadow-2xs self-start sm:self-auto"
          >
            <CheckCircle size={14} className="text-emerald-600" />
            <span>Marcar como lidas</span>
          </button>
        </div>

        {/* Abas de Filtros */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {(["Todas", "Estoque", "Compras", "Sistema"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === tab
                  ? "bg-frigus-primary text-white shadow-xs"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid: Feed de Notificações + Painel Lateral de Preferências */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Feed de Notificações (8 colunas) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-3">
            <h3 className="font-montserrat font-bold text-frigus-navy text-base mb-2">
              Recentes
            </h3>

            <div className="divide-y divide-gray-100">
              {filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  className={`py-4 flex items-start gap-4 transition-colors rounded-xl px-2 ${
                    item.unread ? "bg-blue-50/30" : ""
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                      item.type === "Estoque"
                        ? "bg-amber-50 text-amber-600 border border-amber-200/60"
                        : item.type === "Compras"
                        ? "bg-blue-50 text-frigus-primary border border-blue-200/60"
                        : "bg-emerald-50 text-emerald-600 border border-emerald-200/60"
                    }`}
                  >
                    {item.type === "Estoque" && <Clock size={18} />}
                    {item.type === "Compras" && <ShoppingBasket size={18} />}
                    {item.type === "Sistema" && <TrendingUp size={18} />}
                  </div>

                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-frigus-navy text-sm">
                        {item.title}
                      </h4>
                      <span className="text-[11px] text-gray-400 font-medium">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed font-sans">
                      {item.desc}
                    </p>
                  </div>

                  {item.unread && (
                    <div className="w-2 h-2 rounded-full bg-frigus-primary shrink-0 mt-2" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Painel de Preferências (4 colunas) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="font-montserrat font-bold text-frigus-navy text-base">
                  Preferências
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Escolha como deseja ser avisado.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100">
                  <span className="text-xs font-bold text-frigus-navy">
                    Por e-mail
                  </span>
                  <input
                    type="checkbox"
                    checked={emailNotify}
                    onChange={(e) => setEmailNotify(e.target.checked)}
                    className="rounded text-frigus-primary focus:ring-frigus-primary"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100">
                  <span className="text-xs font-bold text-frigus-navy">
                    No navegador
                  </span>
                  <input
                    type="checkbox"
                    checked={browserNotify}
                    onChange={(e) => setBrowserNotify(e.target.checked)}
                    className="rounded text-frigus-primary focus:ring-frigus-primary"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-frigus-navy">
                      Somente importantes
                    </span>
                    <input
                      type="checkbox"
                      checked={onlyImportant}
                      onChange={(e) => setOnlyImportant(e.target.checked)}
                      className="rounded text-frigus-primary focus:ring-frigus-primary"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 leading-tight">
                    Validades, compras e atualizações de conta.
                  </p>
                </div>
              </div>
            </div>

            <button className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-frigus-navy rounded-xl text-xs font-bold transition-colors">
              Editar preferências
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

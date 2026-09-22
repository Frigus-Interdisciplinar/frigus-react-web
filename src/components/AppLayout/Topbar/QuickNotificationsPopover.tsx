import { Link } from "react-router-dom";
import { X, ArrowRight, AlertTriangle, PackageOpen, UserCheck } from "lucide-react";

export type QuickNotice = {
  id: string;
  title: string;
  description: string;
  type: "warning" | "stock" | "invite";
  link?: string;
};

export type QuickNotificationsPopoverProps = {
  isOpen: boolean;
  onClose: () => void;
};

const notices: QuickNotice[] = [
  {
    id: "1",
    title: "3 alimentos vencem em até 3 dias",
    description: "Consuma primeiro para evitar desperdício.",
    type: "warning",
    link: "/alerts",
  },
  {
    id: "2",
    title: "4 alimentos estão acabando",
    description: "Confira o estoque antes da próxima compra.",
    type: "stock",
    link: "/stock",
  },
  {
    id: "3",
    title: "1 convite aguarda confirmação",
    description: "O novo membro ainda não acessou o Frigus.",
    type: "invite",
    link: "/family-members",
  },
];

export default function QuickNotificationsPopover({
  isOpen,
  onClose,
}: QuickNotificationsPopoverProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop transparente para fechar ao clicar fora */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Popover / Card flutuante */}
      <div
        role="dialog"
        aria-labelledby="quick-notifications-title"
        className="absolute right-0 top-14 w-[380px] sm:w-[460px] bg-white rounded-2xl shadow-[0px_16px_48px_0px_rgba(20,28,84,0.18)] border border-[#E1E7F0] p-6 z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-4"
      >
        {/* Cabeçalho */}
        <div className="flex items-start justify-between">
          <div>
            <h3
              id="quick-notifications-title"
              className="font-montserrat font-bold text-xl text-[#141C55]"
            >
              Notificações da casa
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              O que precisa da sua atenção hoje.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar notificações rápidas"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-frigus-navy hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Lista de Notificações Rápidas */}
        <div className="flex flex-col gap-2.5">
          {notices.map((notice) => (
            <Link
              key={notice.id}
              to={notice.link || "/notifications"}
              onClick={onClose}
              className="p-3.5 rounded-xl bg-[#F5F7FB] hover:bg-[#EDF2FA] transition-colors flex items-start gap-3 group"
            >
              <div className="mt-0.5 w-8 h-8 rounded-lg bg-white border border-gray-100 shadow-2xs flex items-center justify-center shrink-0">
                {notice.type === "warning" && (
                  <AlertTriangle size={16} className="text-amber-500" />
                )}
                {notice.type === "stock" && (
                  <PackageOpen size={16} className="text-blue-500" />
                )}
                {notice.type === "invite" && (
                  <UserCheck size={16} className="text-emerald-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-[#1B2941] group-hover:text-frigus-primary transition-colors">
                  {notice.title}
                </p>
                <p className="text-xs text-[#64748B] mt-0.5">
                  {notice.description}
                </p>
              </div>
              <ArrowRight
                size={14}
                className="text-gray-400 group-hover:text-frigus-primary group-hover:translate-x-0.5 transition-all mt-1"
              />
            </Link>
          ))}
        </div>

        {/* Rodapé com link para ver todas */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">3 avisos ativos</span>
          <Link
            to="/notifications"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-frigus-primary hover:underline cursor-pointer"
          >
            <span>Ver todas as notificações</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </>
  );
}

import { AlertTriangle, AlertCircle, Clock } from "lucide-react";
import type { ModalVisibilityProps } from "@/components/CommercialModals/types";
import { CommercialModalBase } from "@/components/CommercialModalBase";

export function CommercialNotificationsModal({
  isOpen,
  onClose,
}: ModalVisibilityProps) {
  return (
    <CommercialModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Notificações da operação"
      subtitle="O que precisa da sua atenção hoje."
    >
      <div className="space-y-3">
        <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/70 flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-950">
              7 lotes vencem em até 3 dias
            </h4>
            <p className="text-xs text-amber-800 mt-0.5">
              Priorize a saída e reduza as perdas.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/70 flex items-start gap-3">
          <Clock size={18} className="text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-blue-950">
              12 produtos precisam de reposição
            </h4>
            <p className="text-xs text-blue-800 mt-0.5">
              Revise a lista antes do próximo pedido.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50/70 flex items-start gap-3">
          <AlertCircle size={18} className="text-purple-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-purple-950">
              1 convite aguarda confirmação
            </h4>
            <p className="text-xs text-purple-800 mt-0.5">
              Beatriz Costa ainda não acessou o Frigus.
            </p>
          </div>
        </div>
      </div>
    </CommercialModalBase>
  );
}

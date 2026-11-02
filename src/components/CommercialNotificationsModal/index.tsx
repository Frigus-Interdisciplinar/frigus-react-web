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
      <p role="status" className="py-8 text-center text-sm text-gray-500">
        Nenhuma notificação disponível.
      </p>
    </CommercialModalBase>
  );
}

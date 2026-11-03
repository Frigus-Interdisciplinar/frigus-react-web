import type { CommercialResendInviteModalProps } from "@/types/component-props.type";
import { CommercialModalBase } from "@/components/CommercialModalBase";

export function CommercialResendInviteModal({
  isOpen,
  onClose,
  name,
  email,
}: CommercialResendInviteModalProps) {
  return (
    <CommercialModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Reenviar convite"
      subtitle="Confirme o endereço para enviar um novo convite."
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#2552C8] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Reenviar
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="field-components-commercialresendinvitemodal-index-tsx-1"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Nome
          </label>
          <input
            id="field-components-commercialresendinvitemodal-index-tsx-1"
            type="text"
            defaultValue={name}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label
            htmlFor="field-components-commercialresendinvitemodal-index-tsx-2"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            E-mail
          </label>
          <input
            id="field-components-commercialresendinvitemodal-index-tsx-2"
            type="email"
            defaultValue={email}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
      </div>
    </CommercialModalBase>
  );
}

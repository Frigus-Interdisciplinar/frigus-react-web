import { useState } from "react";
import { useResetModalState } from "@/hooks/useResetModalState";
import type { CommercialInviteEmployeeModalProps } from "@/types/commercial-component-props.type";
import { CommercialModalBase } from "@/components/CommercialModalBase";

export function CommercialInviteEmployeeModal({
  isOpen,
  onClose,
  onInvite,
}: CommercialInviteEmployeeModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "EDITOR" as "EDITOR" | "VIEWER",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  useResetModalState(isOpen, () => {
    setForm({ name: "", email: "", role: "EDITOR" });
    setError("");
    setSuccess("");
  });
  return (
    <CommercialModalBase
      isOpen={isOpen}
      onClose={() => {
        setSuccess("");
        setError("");
        onClose();
      }}
      title="Convidar funcionário"
      subtitle="A pessoa receberá um convite por e-mail."
      footer={
        <>
          <button
            type="button"
            disabled={saving}
            onClick={() => {
              setSuccess("");
              setError("");
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={saving || Boolean(success)}
            aria-live="polite"
            onClick={async () => {
              if (!form.email.trim()) {
                setError("Informe o e-mail do funcionário.");
                return;
              }
              setSaving(true);
              setError("");
              setSuccess("");
              try {
                await onInvite?.({
                  name: form.name.trim(),
                  email: form.email.trim(),
                  memberRole: form.role,
                });
                setForm({ name: "", email: "", role: "EDITOR" });
                setSuccess("Convite enviado.");
              } catch {
                setError(
                  "Não foi possível enviar o convite. Confira o e-mail e tente novamente.",
                );
              } finally {
                setSaving(false);
              }
            }}
            className="px-6 py-2.5 rounded-xl bg-[#2552C8] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            {saving ? "Enviando…" : "Enviar convite"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {error && (
          <p role="alert" className="text-xs text-red-600">
            {error}
          </p>
        )}
        {success && (
          <p
            role="status"
            aria-live="polite"
            className="text-xs text-emerald-700"
          >
            {success}
          </p>
        )}
        <div>
          <label
            htmlFor="commercial-invite-name"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Nome completo (opcional)
          </label>
          <input
            id="commercial-invite-name"
            type="text"
            maxLength={255}
            placeholder="Nome do funcionário"
            value={form.name}
            onChange={(e) =>
              setForm((current) => ({ ...current, name: e.target.value }))
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label
            htmlFor="commercial-invite-email"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            E-mail
          </label>
          <input
            id="commercial-invite-email"
            type="email"
            required
            maxLength={254}
            placeholder="nome@exemplo.com"
            value={form.email}
            onChange={(e) =>
              setForm((current) => ({ ...current, email: e.target.value }))
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label
            htmlFor="commercial-invite-role"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Função
          </label>
          <select
            id="commercial-invite-role"
            value={form.role}
            onChange={(e) =>
              setForm((current) => ({
                ...current,
                role: e.target.value as "EDITOR" | "VIEWER",
              }))
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8] bg-white"
          >
            <option value="EDITOR">Equipe · pode editar</option>
            <option value="VIEWER">Operador · somente leitura</option>
          </select>
        </div>
      </div>
    </CommercialModalBase>
  );
}

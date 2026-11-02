import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { useModalFocus } from "@/hooks/useModalFocus";
import { useResetModalState } from "@/hooks/useResetModalState";

export type InviteMemberData = {
  name: string;
  email: string;
  role: "Pode editar" | "Visualizar";
};

export type InviteMemberModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (data: InviteMemberData) => Promise<void>;
  householdName?: string;
};

export default function InviteMemberModal({
  isOpen,
  onClose,
  onInvite,
  householdName = "Casa Henrique",
}: InviteMemberModalProps) {
  const dialogRef = useModalFocus(isOpen, onClose);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Pode editar" as "Pode editar" | "Visualizar",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  useResetModalState(isOpen, () => {
    setForm({ name: "", email: "", role: "Pode editar" });
    setError("");
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.email.trim() || saving) return;
    setSaving(true);
    setError("");
    try {
      await onInvite({
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
      });
      setForm({ name: "", email: "", role: "Pode editar" });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar o convite.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        ref={dialogRef}
        id="invite-member-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-member-title"
        tabIndex={-1}
        className="bg-white dark:bg-[#1C1E22] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-[#DFE7F2] dark:border-[#343941] p-8 relative flex flex-col gap-6"
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-6 right-6 w-9 h-9 rounded-xl flex items-center justify-center text-[#758198] dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-[#252A32] hover:text-frigus-navy dark:hover:text-white transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="space-y-1 pr-6">
          <h2
            id="invite-member-title"
            className="font-montserrat font-bold text-2xl text-[#131C55] dark:text-white"
          >
            Convidar membro
          </h2>
          <p className="text-sm text-[#758198] dark:text-neutral-400">
            Envie um convite para participar da {householdName}.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
          <div>
            <label
              htmlFor="invite-member-name"
              className="text-xs font-semibold text-[#131C55] dark:text-neutral-200 block mb-2"
            >
              Nome (opcional)
            </label>
            <input
              id="invite-member-name"
              type="text"
              maxLength={255}
              value={form.name}
              onChange={(e) =>
                setForm((current) => ({ ...current, name: e.target.value }))
              }
              placeholder="Nome completo"
              className="w-full h-12 px-4 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#DFE7F2] dark:border-[#343941] text-sm text-[#131C55] dark:text-white placeholder:text-[#758198] dark:placeholder:text-neutral-500 focus:outline-hidden focus:border-frigus-primary transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="invite-member-email"
              className="text-xs font-semibold text-[#131C55] dark:text-neutral-200 block mb-2"
            >
              E-mail
            </label>
            <input
              id="invite-member-email"
              type="email"
              required
              maxLength={254}
              value={form.email}
              onChange={(e) =>
                setForm((current) => ({ ...current, email: e.target.value }))
              }
              placeholder="email@exemplo.com"
              className="w-full h-12 px-4 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#DFE7F2] dark:border-[#343941] text-sm text-[#131C55] dark:text-white placeholder:text-[#758198] dark:placeholder:text-neutral-500 focus:outline-hidden focus:border-frigus-primary transition-colors"
            />
          </div>

          <div>
            <span
              id="invite-member-permission-label"
              className="text-xs font-semibold text-[#131C55] dark:text-neutral-200 block mb-2"
            >
              Permissão
            </span>
            <div
              role="group"
              aria-labelledby="invite-member-permission-label"
              className="flex items-center gap-2"
            >
              <button
                type="button"
                aria-pressed={form.role === "Pode editar"}
                onClick={() =>
                  setForm((current) => ({ ...current, role: "Pode editar" }))
                }
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  form.role === "Pode editar"
                    ? "bg-[#E1F2EB] dark:bg-[#122C23] text-[#1F9463] dark:text-[#48C78E] ring-1 ring-[#1F9463]/30"
                    : "bg-[#F5F8FC] dark:bg-[#252A32] text-[#758198] dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-[#2F3540]"
                }`}
              >
                Pode editar
              </button>
              <button
                type="button"
                aria-pressed={form.role === "Visualizar"}
                onClick={() =>
                  setForm((current) => ({ ...current, role: "Visualizar" }))
                }
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  form.role === "Visualizar"
                    ? "bg-blue-50 dark:bg-blue-950/40 text-frigus-primary dark:text-[#5B89F7] ring-1 ring-frigus-primary/30"
                    : "bg-[#F5F8FC] dark:bg-[#252A32] text-[#758198] dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-[#2F3540]"
                }`}
              >
                Visualizar
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#DFE7F2] dark:border-[#343941] mt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-6 rounded-xl border border-[#DFE7F2] dark:border-[#343941] text-sm font-semibold text-[#131C55] dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-[#252A32] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-10 px-6 rounded-xl bg-[#2552C8] hover:bg-blue-700 text-sm font-semibold text-white shadow-xs transition-colors cursor-pointer"
            >
              Enviar convite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

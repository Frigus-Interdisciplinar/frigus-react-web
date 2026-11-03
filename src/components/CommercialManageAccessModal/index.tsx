import { useState } from "react";
import { useResetModalState } from "@/hooks/useResetModalState";
import type { CommercialManageAccessModalProps } from "@/types/commercial-component-props.type";
import { CommercialModalBase } from "@/components/CommercialModalBase";

export function CommercialManageAccessModal({
  isOpen,
  onClose,
  employeeName,
  employeeEmail,
  memberRole,
  onSaveRole,
}: CommercialManageAccessModalProps) {
  const [role, setRole] = useState<"EDITOR" | "VIEWER">(memberRole);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useResetModalState(isOpen, () => {
    setRole(memberRole);
    setError("");
    setSuccess("");
  });
  return (
    <CommercialModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Gerenciar acesso"
      subtitle="Defina a função e o acesso do funcionário."
      footer={
        <>
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={saving || Boolean(success)}
            aria-live="polite"
            onClick={async () => {
              setSaving(true);
              setError("");
              setSuccess("");
              try {
                await onSaveRole?.(role);
                setSuccess("Permissão atualizada.");
              } catch {
                setError("Não foi possível atualizar a permissão.");
              } finally {
                setSaving(false);
              }
            }}
            className="px-6 py-2.5 rounded-xl bg-[#2552C8] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            {saving ? "Salvando…" : "Salvar permissão"}
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
        <div className="rounded-xl bg-gray-50 p-3 text-xs">
          <p className="font-semibold text-[#141C55]">{employeeName}</p>
          <p className="text-gray-500">{employeeEmail}</p>
        </div>
        <div>
          <label
            htmlFor="field-components-commercialmanageaccessmodal-index-tsx-1"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Função
          </label>
          <select
            id="field-components-commercialmanageaccessmodal-index-tsx-1"
            value={role}
            onChange={(e) => setRole(e.target.value as "EDITOR" | "VIEWER")}
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

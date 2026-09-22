import { useState, type FormEvent } from "react";
import { X, Check } from "lucide-react";

export type InviteMemberData = {
  name: string;
  email: string;
  role: "Pode editar" | "Visualizar";
};

export type InviteMemberModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (data: InviteMemberData) => void;
  householdName?: string;
};

export default function InviteMemberModal({
  isOpen,
  onClose,
  onInvite,
  householdName = "Casa Henrique",
}: InviteMemberModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"Pode editar" | "Visualizar">("Pode editar");
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onInvite({ name, email, role });
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setName("");
      setEmail("");
      setRole("Pode editar");
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-[#DFE7F2] p-8 relative flex flex-col gap-6">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-6 right-6 w-9 h-9 rounded-xl flex items-center justify-center text-[#758198] hover:bg-gray-100 hover:text-frigus-navy transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Cabeçalho */}
        <div className="space-y-1 pr-6">
          <h2 className="font-montserrat font-bold text-2xl text-[#131C55]">
            Convidar membro
          </h2>
          <p className="text-sm text-[#758198]">
            Envie um convite para participar da {householdName}.
          </p>
        </div>

        {isSuccess ? (
          <div className="py-8 flex flex-col items-center justify-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-[#E1F2EB] text-[#1F9463] flex items-center justify-center">
              <Check size={24} />
            </div>
            <p className="font-montserrat font-bold text-base text-[#131C55]">
              Convite enviado com sucesso!
            </p>
            <p className="text-xs text-[#758198]">
              Um e-mail de acesso foi enviado para {email}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Nome */}
            <div>
              <label className="text-xs font-semibold text-[#131C55] block mb-2">
                Nome
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome completo"
                className="w-full h-12 px-4 rounded-xl bg-[#F5F8FC] border border-[#DFE7F2] text-sm text-[#131C55] placeholder:text-[#758198] focus:outline-hidden focus:border-frigus-primary transition-colors"
              />
            </div>

            {/* E-mail */}
            <div>
              <label className="text-xs font-semibold text-[#131C55] block mb-2">
                E-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplo.com"
                className="w-full h-12 px-4 rounded-xl bg-[#F5F8FC] border border-[#DFE7F2] text-sm text-[#131C55] placeholder:text-[#758198] focus:outline-hidden focus:border-frigus-primary transition-colors"
              />
            </div>

            {/* Permissão */}
            <div>
              <label className="text-xs font-semibold text-[#131C55] block mb-2">
                Permissão
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRole("Pode editar")}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    role === "Pode editar"
                      ? "bg-[#E1F2EB] text-[#1F9463] ring-1 ring-[#1F9463]/30"
                      : "bg-[#F5F8FC] text-[#758198] hover:bg-gray-100"
                  }`}
                >
                  Pode editar
                </button>
                <button
                  type="button"
                  onClick={() => setRole("Visualizar")}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    role === "Visualizar"
                      ? "bg-blue-50 text-frigus-primary ring-1 ring-frigus-primary/30"
                      : "bg-[#F5F8FC] text-[#758198] hover:bg-gray-100"
                  }`}
                >
                  Visualizar
                </button>
              </div>
            </div>

            {/* Ações */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#DFE7F2] mt-2">
              <button
                type="button"
                onClick={onClose}
                className="h-10 px-6 rounded-xl border border-[#DFE7F2] text-sm font-semibold text-[#131C55] hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="h-10 px-6 rounded-xl bg-[#2552C8] hover:bg-blue-700 text-sm font-semibold text-white shadow-xs transition-colors cursor-pointer"
              >
                Enviar convite
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

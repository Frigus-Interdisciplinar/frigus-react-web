import { useState } from "react";
import { UserPlus, Shield, Mail, CheckCircle2 } from "lucide-react";
import AppLayout from "@/components/Layout/AppLayout";
import Badge from "@/components/Common/Badge";

type Member = {
  id: string;
  name: string;
  email: string;
  role: string;
  roleType: "admin" | "editor" | "viewer";
  lastAccess: string;
  isCurrentUser?: boolean;
  avatarLetter: string;
  avatarBg: string;
};

const members: Member[] = [
  {
    id: "1",
    name: "Henrique Paulo",
    email: "henrique@email.com",
    role: "Administrador",
    roleType: "admin",
    lastAccess: "Agora",
    isCurrentUser: true,
    avatarLetter: "H",
    avatarBg: "bg-frigus-ice text-frigus-navy",
  },
  {
    id: "2",
    name: "Marina Souza",
    email: "marina@email.com",
    role: "Pode editar",
    roleType: "editor",
    lastAccess: "Hoje, 08:32",
    avatarLetter: "M",
    avatarBg: "bg-blue-100 text-blue-700",
  },
  {
    id: "3",
    name: "Lucas Paulo",
    email: "lucas@email.com",
    role: "Pode editar",
    roleType: "editor",
    lastAccess: "Ontem, 20:16",
    avatarLetter: "L",
    avatarBg: "bg-amber-100 text-amber-700",
  },
  {
    id: "4",
    name: "Clara Paulo",
    email: "clara@email.com",
    role: "Visualizar",
    roleType: "viewer",
    lastAccess: "12 ago, 19:40",
    avatarLetter: "C",
    avatarBg: "bg-purple-100 text-purple-700",
  },
];

export default function FamilyMembersPage() {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteSent, setInviteSent] = useState(false);

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setInviteSent(true);
    setTimeout(() => {
      setInviteSent(false);
      setIsInviteOpen(false);
      setInviteEmail("");
    }, 1500);
  };

  return (
    <AppLayout activeSection="family-members">
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-frigus-navy">
              Membros da casa
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-sans">
              Defina quem pode acompanhar e atualizar o estoque da família
            </p>
          </div>

          <button
            onClick={() => setIsInviteOpen(true)}
            className="inline-flex items-center gap-2 bg-frigus-primary hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-xs self-start sm:self-auto"
          >
            <UserPlus size={16} />
            <span>Convidar membro</span>
          </button>
        </div>

        {/* Hero Banner */}
        <div className="bg-frigus-primary rounded-3xl p-6 md:p-8 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 max-w-xl z-10">
            <span className="text-[11px] uppercase tracking-wider font-bold text-frigus-ice font-sans">
              Sua casa
            </span>
            <h2 className="font-montserrat font-bold text-2xl md:text-3xl leading-tight">
              Todo mundo alinhado para cuidar do estoque
            </h2>
            <p className="text-frigus-ice text-sm font-sans leading-relaxed">
              Adicione pessoas, organize permissões e compartilhe a rotina da casa
            </p>
          </div>

          <div className="flex items-center -space-x-3 z-10 shrink-0">
            {members.map((m) => (
              <div
                key={m.id}
                className={`w-12 h-12 rounded-full border-2 border-white flex items-center justify-center font-bold text-sm shadow-sm ${m.avatarBg}`}
              >
                {m.avatarLetter}
              </div>
            ))}
          </div>
        </div>

        {/* Tabela de Membros */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
            <h3 className="font-montserrat font-bold text-frigus-navy text-base">
              Pessoas da casa
            </h3>
            <span className="text-xs font-bold text-frigus-primary bg-blue-50 px-3 py-1 rounded-xl">
              {members.length} membros
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="py-3 px-4">Membro</th>
                  <th className="py-3 px-4">Permissão</th>
                  <th className="py-3 px-4">Último Acesso</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${member.avatarBg}`}
                        >
                          {member.avatarLetter}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-frigus-navy text-sm">
                              {member.name}
                            </span>
                            {member.isCurrentUser && (
                              <Badge variant="primary" className="text-[10px] py-0 px-2">
                                Você
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-gray-400 font-normal">
                            {member.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg ${
                          member.roleType === "admin"
                            ? "bg-purple-50 text-purple-700"
                            : member.roleType === "editor"
                            ? "bg-blue-50 text-frigus-primary"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {member.roleType === "admin" && <Shield size={13} />}
                        {member.role}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-xs text-gray-500 font-medium">
                      {member.lastAccess}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <button className="px-3 py-1 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors">
                        {member.isCurrentUser ? "Editar" : "Gerir"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de Convidar Membro */}
        {isInviteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-md border border-gray-100 space-y-4">
              <h3 className="font-montserrat font-bold text-frigus-navy text-lg">
                Convidar novo membro
              </h3>
              <p className="text-xs text-gray-500 font-sans">
                Envie um convite por e-mail para que outra pessoa da família possa acessar e gerenciar o estoque.
              </p>

              {inviteSent ? (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 size={24} className="text-emerald-600 mx-auto" />
                  <p className="text-xs font-bold text-emerald-800">
                    Convite enviado com sucesso!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendInvite} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">
                      E-mail do membro
                    </label>
                    <div className="relative">
                      <Mail
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="email"
                        required
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="exemplo@email.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-frigus-primary"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsInviteOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-frigus-primary text-white text-xs font-bold hover:bg-blue-700 shadow-xs"
                    >
                      Enviar convite
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

import { useState } from "react";
import { UserPlus, Shield } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import Badge from "@/components/Badge";
import { InviteMemberModal } from "@/components/Modal";
import type { InviteMemberData } from "@/components/Modal/InviteMemberModal";

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

const initialMembers: Member[] = [
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
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const handleInvite = (data: InviteMemberData) => {
    const newMember: Member = {
      id: String(Date.now()),
      name: data.name,
      email: data.email,
      role: data.role,
      roleType: data.role === "Pode editar" ? "editor" : "viewer",
      lastAccess: "Pendente",
      avatarLetter: data.name.charAt(0).toUpperCase() || "U",
      avatarBg: "bg-emerald-100 text-emerald-700",
    };
    setMembers((prev) => [...prev, newMember]);
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
            type="button"
            onClick={() => setIsInviteOpen(true)}
            className="inline-flex items-center gap-2 bg-[#2552C8] hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-xs self-start sm:self-auto cursor-pointer"
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
              Mantenha os familiares a par do que precisa ser comprado e evite desperdícios na rotina doméstica.
            </p>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-5 border border-white/20 w-full sm:w-auto flex items-center gap-6 z-10 shrink-0">
            <div className="text-center">
              <span className="font-montserrat font-bold text-2xl text-white block">
                {members.length}
              </span>
              <span className="text-[11px] text-frigus-ice uppercase tracking-wider font-semibold">
                Membros
              </span>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <span className="font-montserrat font-bold text-2xl text-white block">
                1
              </span>
              <span className="text-[11px] text-frigus-ice uppercase tracking-wider font-semibold">
                Administrador
              </span>
            </div>
          </div>

          {/* Background circles */}
          <div className="absolute right-0 bottom-0 w-64 h-64 rounded-full bg-blue-600/30 blur-2xl pointer-events-none" />
          <div className="absolute left-1/2 -top-10 w-48 h-48 rounded-full bg-frigus-accent/20 blur-2xl pointer-events-none" />
        </div>

        {/* Informações sobre Permissões */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-gray-200/80 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-frigus-primary flex items-center justify-center shrink-0">
              <Shield size={16} />
            </div>
            <div>
              <h3 className="font-montserrat font-bold text-xs text-frigus-navy">
                Administrador
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Controle total, convite de novos membros e alteração de planos.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-200/80 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Shield size={16} />
            </div>
            <div>
              <h3 className="font-montserrat font-bold text-xs text-frigus-navy">
                Pode editar
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Adiciona, remove e atualiza itens no estoque e lista de compras.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-200/80 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Shield size={16} />
            </div>
            <div>
              <h3 className="font-montserrat font-bold text-xs text-frigus-navy">
                Visualizar
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Acompanha a disponibilidade dos alimentos e status das listas.
              </p>
            </div>
          </div>
        </div>

        {/* Tabela de Membros */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-montserrat font-bold text-frigus-navy text-base">
                Pessoas com acesso
              </h3>
              <p className="text-xs text-gray-400">
                {members.length} membros conectados à sua conta familiar
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="py-3 px-4">Membro</th>
                  <th className="py-3 px-4">Permissão</th>
                  <th className="py-3 px-4">Último acesso</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {members.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-gray-50/70 transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-bold text-frigus-navy">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full ${member.avatarBg} font-bold flex items-center justify-center text-xs shrink-0`}
                        >
                          {member.avatarLetter}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-frigus-navy text-sm">
                              {member.name}
                            </span>
                            {member.isCurrentUser && (
                              <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md">
                                Você
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 font-normal">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {member.roleType === "admin" && (
                        <Badge variant="primary">{member.role}</Badge>
                      )}
                      {member.roleType === "editor" && (
                        <Badge variant="success">{member.role}</Badge>
                      )}
                      {member.roleType === "viewer" && (
                        <Badge variant="neutral">{member.role}</Badge>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-gray-500 text-xs">
                      {member.lastAccess}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {member.isCurrentUser ? (
                        <span className="text-xs text-gray-400 italic">
                          Titular
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="text-xs font-semibold text-gray-500 hover:text-frigus-primary transition-colors cursor-pointer"
                        >
                          Gerenciar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Dedicado de Convidar Membro (Figma 1879:4682) */}
        <InviteMemberModal
          isOpen={isInviteOpen}
          onClose={() => setIsInviteOpen(false)}
          onInvite={handleInvite}
          householdName="Casa Henrique"
        />
      </div>
    </AppLayout>
  );
}

import { useEffect, useState } from "react";
import { UserPlus, Shield, Users, Mail } from "lucide-react";
import CommercialLayout from "@/components/CommercialLayout";
import {
  CommercialInviteEmployeeModal,
  CommercialManageAccessModal,
} from "@/components/CommercialModals";
import { api } from "@/utils/api.util";

type Employee = { userId: string; name: string; email: string; isOwner?: boolean; memberRole?: string };

export default function CommercialEmployeesPage() {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [groupId, setGroupId] = useState<string>();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [invitations, setInvitations] = useState<Array<{ id: string; name?: string; email: string; acceptedAt?: string; revokedAt?: string }>>([]);
  const [loadError, setLoadError] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee>();

  useEffect(() => {
    let active = true;
    void api.get<{ groupId: string }>("/web/core/inventory/active-context")
      .then(async (context) => {
        if (!active) return;
        setGroupId(context.groupId);
        const result = await api.get<Employee[]>(`/web/core/commercial/groups/${context.groupId}/employees`);
        if (active) setEmployees(result);
        const pending = await api.get<typeof invitations>(`/web/core/groups/${context.groupId}/invitations`);
        if (active) setInvitations(pending.filter((invite) => !invite.acceptedAt && !invite.revokedAt));
      })
      .catch(() => active && setLoadError("Não foi possível carregar a equipe comercial."));
    return () => { active = false; };
  }, []);

  const inviteEmployee = async (data: { name: string; email: string; memberRole: "EDITOR" | "VIEWER" }) => {
    if (!groupId) throw new Error("Grupo comercial indisponível");
    await api.post(`/web/core/commercial/groups/${groupId}/employees/invitations`, data);
    const pending = await api.get<typeof invitations>(`/web/core/groups/${groupId}/invitations`);
    setInvitations(pending.filter((invite) => !invite.acceptedAt && !invite.revokedAt));
  };

  const saveRole = async (role: "EDITOR" | "VIEWER") => {
    if (!groupId || !selectedEmployee) throw new Error("Membro indisponível");
    await api.patch(`/web/core/groups/${groupId}/members/${selectedEmployee.userId}/role`, { memberRole: role });
    setEmployees((current) => current.map((member) => member.userId === selectedEmployee.userId ? { ...member, memberRole: role } : member));
  };

  const roleDescriptions = [
    {
      role: "Proprietário",
      description: "Responsável pelo grupo e pelo gerenciamento dos membros.",
    },
    {
      role: "Equipe · edição",
      description: "Pode atualizar o estoque, as listas e os registros comerciais.",
    },
    {
      role: "Operador · leitura",
      description: "Pode consultar os dados, sem alterar registros.",
    },
  ];

  const handleOpenManage = (emp: Employee) => {
    setSelectedEmployee(emp);
    setIsManageModalOpen(true);
  };

  return (
    <CommercialLayout
      activeSection="employees"
      breadcrumb="Área comercial    /    Funcionários"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-[#141C55] dark:text-white">
            Gerenciar funcionários
          </h1>
          <p className="text-xs text-[#64748B] dark:text-neutral-400 mt-1">
            A equipe certa, com acesso ao que precisa para trabalhar.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsInviteModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#2552C8] hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <UserPlus size={16} />
          <span>Convidar funcionário</span>
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1C1E22] p-5 rounded-2xl border border-[#e1e7f0] dark:border-[#343941] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#2552C8] dark:text-blue-400 flex items-center justify-center font-bold">
            <Users size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold font-montserrat text-[#141C55] dark:text-white">{employees.length}</p>
            <span className="text-xs text-[#64748B] dark:text-neutral-400">Pessoas ativas</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1C1E22] p-5 rounded-2xl border border-[#e1e7f0] dark:border-[#343941] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <Mail size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold font-montserrat text-[#141C55] dark:text-white">{invitations.length}</p>
            <span className="text-xs text-[#64748B] dark:text-neutral-400">Convite pendente</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1C1E22] p-5 rounded-2xl border border-[#e1e7f0] dark:border-[#343941] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Shield size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold font-montserrat text-[#141C55] dark:text-white">3</p>
            <span className="text-xs text-[#64748B] dark:text-neutral-400">Perfis de acesso</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Equipe / Colaboradores (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-[#1C1E22] rounded-3xl border border-[#e1e7f0] dark:border-[#343941] shadow-xs p-6 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-[#343941] text-[10px] font-bold text-[#64748B] dark:text-neutral-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Funcionário</th>
                    <th className="py-2.5 px-3">Função</th>
                    <th className="py-2.5 px-3">Último acesso</th>
                    <th className="py-2.5 px-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-[#343941]">
                  {loadError && <tr><td colSpan={4} className="py-4 text-sm text-red-700">{loadError}</td></tr>}
                  {!loadError && employees.length === 0 && <tr><td colSpan={4} className="py-4 text-sm text-gray-500">Nenhum membro cadastrado na equipe.</td></tr>}
                  {employees.map((emp, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/70 dark:hover:bg-[#252A32]/50 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#EAF1FF] dark:bg-blue-950/60 text-[#131C55] dark:text-blue-200 font-bold text-xs flex items-center justify-center shrink-0">
                            {emp.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-[#141C55] dark:text-white">{emp.name}</p>
                            <p className="text-[11px] text-[#64748B] dark:text-neutral-400">{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 dark:bg-[#252A32] text-gray-700 dark:text-neutral-300">
                          {emp.isOwner ? "Proprietário" : emp.memberRole === "VIEWER" ? "Operador · leitura" : "Equipe · edição"}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-gray-500 dark:text-neutral-400 font-medium">
                        {emp.isOwner ? "Proprietário" : "Membro da equipe"}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        {!emp.isOwner && <button
                          type="button"
                          onClick={() => handleOpenManage(emp)}
                          className="px-3 py-1 rounded-lg text-xs font-semibold text-[#2552C8] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors cursor-pointer"
                        >
                          Gerenciar
                        </button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {invitations.map((invite) => (
            <div key={invite.id} className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/50 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-purple-200 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 font-bold text-xs flex items-center justify-center shrink-0">{(invite.name || invite.email).slice(0, 2).toUpperCase()}</div>
              <div><p className="text-xs font-bold text-[#141C55] dark:text-white">{invite.name || invite.email}</p><span className="text-[11px] text-purple-700 dark:text-purple-300">Convite pendente · {invite.email}</span></div>
            </div>
          ))}
        </div>

        {/* Acessos por Função (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#1C1E22] rounded-3xl border border-[#e1e7f0] dark:border-[#343941] shadow-xs p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold font-montserrat text-[#141C55] dark:text-white">
              Acessos por função
            </h2>
            <p className="text-xs text-[#64748B] dark:text-neutral-400 mt-0.5">
              Cada pessoa vê as ferramentas necessárias para sua rotina.
            </p>
          </div>

          <div className="space-y-4 pt-2 divide-y divide-gray-100 dark:divide-[#343941]">
            {roleDescriptions.map((item, idx) => (
              <div key={idx} className={idx > 0 ? "pt-3.5" : ""}>
                <h3 className="text-xs font-bold text-[#141C55] dark:text-white">{item.role}</h3>
                <p className="text-xs text-[#64748B] dark:text-neutral-400 mt-0.5 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modais */}
      <CommercialInviteEmployeeModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={inviteEmployee}
      />
      {selectedEmployee && <CommercialManageAccessModal
        key={selectedEmployee.userId}
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        employeeName={selectedEmployee.name}
        employeeEmail={selectedEmployee.email}
        memberRole={selectedEmployee.memberRole === "VIEWER" ? "VIEWER" : "EDITOR"}
        onSaveRole={saveRole}
      />}
    </CommercialLayout>
  );
}

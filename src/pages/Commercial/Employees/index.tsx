import { useState } from "react";
import { UserPlus, Shield, Users, Mail, Clock } from "lucide-react";
import CommercialLayout from "@/components/CommercialLayout";
import {
  CommercialInviteEmployeeModal,
  CommercialManageAccessModal,
  CommercialResendInviteModal,
} from "@/components/CommercialModals";

export default function CommercialEmployeesPage() {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isResendModalOpen, setIsResendModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState({
    name: "Ana Souza",
    email: "ana@saborecia.com",
  });

  const employees = [
    {
      avatar: "AS",
      name: "Ana Souza",
      email: "ana@saborecia.com",
      role: "Gerente",
      lastAccess: "Agora",
    },
    {
      avatar: "CL",
      name: "Carlos Lima",
      email: "carlos@saborecia.com",
      role: "Estoquista",
      lastAccess: "Hoje, 08:32",
    },
    {
      avatar: "JM",
      name: "Júlia Mendes",
      email: "julia@saborecia.com",
      role: "Compras",
      lastAccess: "Ontem, 20:16",
    },
    {
      avatar: "RA",
      name: "Rafael Alves",
      email: "rafael@saborecia.com",
      role: "Operador",
      lastAccess: "Ontem, 19:40",
    },
  ];

  const roleDescriptions = [
    {
      role: "Gerente",
      description: "Gerencia acessos, compras e os resultados da operação.",
    },
    {
      role: "Estoquista",
      description: "Atualiza produtos, lotes, quantidades e validades.",
    },
    {
      role: "Compras",
      description: "Organiza a lista, registra pedidos e acompanha os fornecedores.",
    },
    {
      role: "Operador",
      description: "Consulta o estoque e registra as movimentações do dia.",
    },
  ];

  const handleOpenManage = (emp: { name: string; email: string }) => {
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
          <h1 className="text-2xl font-bold font-montserrat text-[#141C55]">
            Gerenciar funcionários
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
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
        <div className="bg-white p-5 rounded-2xl border border-[#e1e7f0] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2552C8] flex items-center justify-center font-bold">
            <Users size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold font-montserrat text-[#141C55]">4</p>
            <span className="text-xs text-[#64748B]">Pessoas ativas</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e1e7f0] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Mail size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold font-montserrat text-[#141C55]">1</p>
            <span className="text-xs text-[#64748B]">Convite pendente</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e1e7f0] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Shield size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold font-montserrat text-[#141C55]">4</p>
            <span className="text-xs text-[#64748B]">Perfis de acesso</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Equipe / Colaboradores (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-[#e1e7f0] shadow-xs p-6 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                    <th className="py-2.5 px-3">Funcionário</th>
                    <th className="py-2.5 px-3">Função</th>
                    <th className="py-2.5 px-3">Último acesso</th>
                    <th className="py-2.5 px-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {employees.map((emp, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#EAF1FF] text-[#131C55] font-bold text-xs flex items-center justify-center shrink-0">
                            {emp.avatar}
                          </div>
                          <div>
                            <p className="font-bold text-[#141C55]">{emp.name}</p>
                            <p className="text-[11px] text-[#64748B]">{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700">
                          {emp.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-gray-500 font-medium">
                        {emp.lastAccess}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenManage(emp)}
                          className="px-3 py-1 rounded-lg text-xs font-semibold text-[#2552C8] hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          Gerenciar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Convite Pendente Card */}
          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-purple-200 text-purple-800 font-bold text-xs flex items-center justify-center shrink-0">
                BC
              </div>
              <div>
                <p className="text-xs font-bold text-[#141C55]">
                  Beatriz Costa <span className="font-normal text-[#64748B]">beatriz@saborecia.com</span>
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] text-purple-700 font-medium mt-0.5">
                  <Clock size={12} /> Convite pendente há 2 dias
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsResendModalOpen(true)}
              className="px-3.5 py-2 rounded-xl border border-purple-300 text-purple-800 hover:bg-purple-100 text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto"
            >
              Reenviar convite
            </button>
          </div>
        </div>

        {/* Acessos por Função (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#e1e7f0] shadow-xs p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold font-montserrat text-[#141C55]">
              Acessos por função
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Cada pessoa vê as ferramentas necessárias para sua rotina.
            </p>
          </div>

          <div className="space-y-4 pt-2 divide-y divide-gray-100">
            {roleDescriptions.map((item, idx) => (
              <div key={idx} className={idx > 0 ? "pt-3.5" : ""}>
                <h3 className="text-xs font-bold text-[#141C55]">{item.role}</h3>
                <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">
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
      />
      <CommercialManageAccessModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        employeeName={selectedEmployee.name}
        employeeEmail={selectedEmployee.email}
      />
      <CommercialResendInviteModal
        isOpen={isResendModalOpen}
        onClose={() => setIsResendModalOpen(false)}
      />
    </CommercialLayout>
  );
}

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { User, Mail, Phone, Home, Shield, Bell, Edit } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import Badge from "@/components/Badge";
import { useStore } from "@/store/store";
import { api } from "@/utils/api.util";

export default function ProfilePage() {
  const user = useStore((state) => state.user);
  const [groupName, setGroupName] = useState("—");
  const [memberCount, setMemberCount] = useState(1);
  const [itemCount, setItemCount] = useState(0);
  const accountLabel = user?.accountType === "COMMERCIAL" ? "Comercial" : user?.accountType === "BUSINESS" ? "Empresarial" : "Doméstica";
  const initials = user?.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() ?? "";
  useEffect(() => {
    void api.get<Array<{ name: string; membersCount: number }>>("/web/core/groups").then((groups) => {
      if (groups[0]) { setGroupName(groups[0].name); setMemberCount(groups[0].membersCount); }
    }).catch(() => undefined);
    void api.get<{ itemCount: number }>("/web/core/inventory/summary").then((summary) => setItemCount(summary.itemCount)).catch(() => undefined);
  }, []);
  return (
    <AppLayout activeSection="profile">
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <div>
          <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-frigus-navy dark:text-white">
            Meu perfil
          </h1>
          <p className="text-gray-500 dark:text-neutral-400 text-sm mt-1 font-sans">
            Gerencie seus dados, preferências e acesso em um só lugar
          </p>
        </div>

        {/* Hero Card do Usuário */}
        <div className="bg-white dark:bg-[#1C1E22] rounded-3xl p-6 md:p-8 border border-gray-200/80 dark:border-[#343941] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-frigus-ice dark:bg-[#252A32] text-frigus-navy dark:text-blue-300 font-montserrat font-bold text-2xl flex items-center justify-center border-4 border-blue-50 dark:border-[#343941] shadow-sm shrink-0">
                {initials}
              </div>
              <div className="text-center sm:text-left space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h2 className="font-montserrat font-bold text-xl text-frigus-navy dark:text-white">
                    {user?.name}
                  </h2>
                  <Badge variant="success">Conta ativa</Badge>
                </div>
                <p className="text-xs text-gray-400 dark:text-neutral-400 font-medium">
                  {user?.email}
                </p>
              </div>
            </div>

            <Link to="/settings" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#343941] text-xs font-bold text-frigus-navy dark:text-white hover:bg-gray-50 dark:hover:bg-[#252A32] transition-colors shadow-xs cursor-pointer">
              <Edit size={15} />
              <span>Editar perfil</span>
            </Link>
          </div>

          {/* Faixa de Estatísticas */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100 dark:border-[#343941]">
            <div className="text-center sm:text-left p-3 rounded-2xl bg-gray-50 dark:bg-[#252A32] border border-gray-100 dark:border-[#343941]">
              <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-neutral-400 tracking-wider block">
                Plano
              </span>
              <span className="font-montserrat font-bold text-base text-frigus-primary dark:text-blue-400">
                {accountLabel}
              </span>
            </div>
            <div className="text-center sm:text-left p-3 rounded-2xl bg-gray-50 dark:bg-[#252A32] border border-gray-100 dark:border-[#343941]">
              <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-neutral-400 tracking-wider block">
                Membros
              </span>
              <span className="font-montserrat font-bold text-base text-frigus-navy dark:text-white">
                {memberCount} {memberCount === 1 ? "pessoa" : "pessoas"}
              </span>
            </div>
            <div className="text-center sm:text-left p-3 rounded-2xl bg-gray-50 dark:bg-[#252A32] border border-gray-100 dark:border-[#343941]">
              <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-neutral-400 tracking-wider block">
                Estoque
              </span>
              <span className="font-montserrat font-bold text-base text-frigus-navy dark:text-white">
                {itemCount} itens
              </span>
            </div>
          </div>
        </div>

        {/* Dados Pessoais */}
        <div className="bg-white dark:bg-[#1C1E22] rounded-3xl p-6 md:p-8 border border-gray-200/80 dark:border-[#343941] shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-montserrat font-bold text-frigus-navy dark:text-white text-base">
                Dados pessoais
              </h3>
              <p className="text-xs text-gray-400 dark:text-neutral-400 mt-0.5">
                Informações usadas na sua conta doméstica.
              </p>
            </div>

            <Link to="/settings" className="text-xs font-bold text-frigus-primary dark:text-blue-400 hover:underline cursor-pointer">
              Editar dados pessoais
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-gray-50/60 dark:bg-[#252A32] border border-gray-100 dark:border-[#343941] space-y-1">
              <div className="flex items-center gap-2 text-gray-400 dark:text-neutral-400 text-xs">
                <User size={14} />
                <span>Nome completo</span>
              </div>
              <p className="font-bold text-frigus-navy dark:text-white text-sm">{user?.name}</p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50/60 dark:bg-[#252A32] border border-gray-100 dark:border-[#343941] space-y-1">
              <div className="flex items-center gap-2 text-gray-400 dark:text-neutral-400 text-xs">
                <Mail size={14} />
                <span>E-mail cadastrado</span>
              </div>
              <p className="font-bold text-frigus-navy dark:text-white text-sm">{user?.email}</p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50/60 dark:bg-[#252A32] border border-gray-100 dark:border-[#343941] space-y-1">
              <div className="flex items-center gap-2 text-gray-400 dark:text-neutral-400 text-xs">
                <Phone size={14} />
                <span>Telefone</span>
              </div>
              <p className="font-bold text-frigus-navy dark:text-white text-sm">Não informado</p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50/60 dark:bg-[#252A32] border border-gray-100 dark:border-[#343941] space-y-1">
              <div className="flex items-center gap-2 text-gray-400 dark:text-neutral-400 text-xs">
                <Home size={14} />
                <span>Nome da casa</span>
              </div>
              <p className="font-bold text-frigus-navy dark:text-white text-sm">{groupName}</p>
            </div>
          </div>
        </div>

        {/* Preferências e Plano */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Card Preferências */}
          <div className="bg-white dark:bg-[#1C1E22] rounded-3xl p-6 border border-gray-200/80 dark:border-[#343941] shadow-xs space-y-4">
            <h3 className="font-montserrat font-bold text-frigus-navy dark:text-white text-base">
              Preferências
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-[#252A32] border border-gray-100 dark:border-[#343941]">
                <div className="flex items-center gap-3">
                  <Bell size={16} className="text-frigus-primary dark:text-blue-400" />
                  <div>
                    <p className="text-xs font-bold text-frigus-navy dark:text-white">
                      Notificações por e-mail
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-neutral-400">
                      Validade, compras e novidades
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded text-frigus-primary focus:ring-frigus-primary"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-[#252A32] border border-gray-100 dark:border-[#343941]">
                <div className="flex items-center gap-3">
                  <Shield size={16} className="text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="text-xs font-bold text-frigus-navy dark:text-white">
                      Alertas de estoque
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-neutral-400">
                      Avisos de produtos vencendo
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded text-frigus-primary focus:ring-frigus-primary"
                />
              </div>
            </div>
          </div>

          {/* Card Plano Atual */}
          <div className="bg-frigus-navy dark:bg-[#18233C] text-white rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4 border border-transparent dark:border-blue-900/30">
            <div>
              <span className="text-[10px] font-bold text-frigus-ice dark:text-blue-200 uppercase tracking-wider block">
                Assinatura
              </span>
              <h3 className="font-montserrat font-bold text-lg mt-1">
                Plano Doméstico Gratuito
              </h3>
              <p className="text-xs text-frigus-ice/80 dark:text-blue-200/80 mt-1 leading-relaxed">
                Você está utilizando a versão Free com até 40 produtos e 1 geladeira.
              </p>
            </div>

            <Link
              to="/plans"
              className="py-2.5 px-4 bg-frigus-accent hover:bg-[#F2BD50] text-frigus-navy rounded-xl text-xs font-bold text-center block transition-colors"
            >
              Fazer upgrade de plano
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

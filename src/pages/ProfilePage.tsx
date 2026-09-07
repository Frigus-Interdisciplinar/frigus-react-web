import { Link } from "react-router-dom";
import { User, Mail, Phone, Home, Shield, Bell, Edit } from "lucide-react";
import AppLayout from "@/components/Layout/AppLayout";
import Badge from "@/components/Common/Badge";

export default function ProfilePage() {
  return (
    <AppLayout activeSection="profile">
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <div>
          <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-frigus-navy">
            Meu perfil
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-sans">
            Gerencie seus dados, preferências e acesso em um só lugar
          </p>
        </div>

        {/* Hero Card do Usuário */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-frigus-ice text-frigus-navy font-montserrat font-bold text-2xl flex items-center justify-center border-4 border-blue-50 shadow-sm shrink-0">
                HP
              </div>
              <div className="text-center sm:text-left space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h2 className="font-montserrat font-bold text-xl text-frigus-navy">
                    Henrique Paulo
                  </h2>
                  <Badge variant="success">Conta ativa</Badge>
                </div>
                <p className="text-xs text-gray-400 font-medium">
                  henrique.paulo@exemplo.com
                </p>
              </div>
            </div>

            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-frigus-navy hover:bg-gray-50 transition-colors shadow-xs">
              <Edit size={15} />
              <span>Editar perfil</span>
            </button>
          </div>

          {/* Faixa de Estatísticas */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
            <div className="text-center sm:text-left p-3 rounded-2xl bg-gray-50 border border-gray-100">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                Plano
              </span>
              <span className="font-montserrat font-bold text-base text-frigus-primary">
                Doméstico
              </span>
            </div>
            <div className="text-center sm:text-left p-3 rounded-2xl bg-gray-50 border border-gray-100">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                Membros
              </span>
              <span className="font-montserrat font-bold text-base text-frigus-navy">
                4 pessoas
              </span>
            </div>
            <div className="text-center sm:text-left p-3 rounded-2xl bg-gray-50 border border-gray-100">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                Estoque
              </span>
              <span className="font-montserrat font-bold text-base text-frigus-navy">
                46 itens
              </span>
            </div>
          </div>
        </div>

        {/* Dados Pessoais */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-montserrat font-bold text-frigus-navy text-base">
                Dados pessoais
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Informações usadas na sua conta doméstica.
              </p>
            </div>

            <button className="text-xs font-bold text-frigus-primary hover:underline">
              Editar dados pessoais
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-gray-50/60 border border-gray-100 space-y-1">
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <User size={14} />
                <span>Nome completo</span>
              </div>
              <p className="font-bold text-frigus-navy text-sm">Henrique Paulo</p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50/60 border border-gray-100 space-y-1">
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <Mail size={14} />
                <span>E-mail cadastrado</span>
              </div>
              <p className="font-bold text-frigus-navy text-sm">henrique.paulo@exemplo.com</p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50/60 border border-gray-100 space-y-1">
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <Phone size={14} />
                <span>Telefone</span>
              </div>
              <p className="font-bold text-frigus-navy text-sm">(11) 99999-9999</p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50/60 border border-gray-100 space-y-1">
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <Home size={14} />
                <span>Nome da casa</span>
              </div>
              <p className="font-bold text-frigus-navy text-sm">Casa Henrique</p>
            </div>
          </div>
        </div>

        {/* Preferências e Plano */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Card Preferências */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
            <h3 className="font-montserrat font-bold text-frigus-navy text-base">
              Preferências
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-3">
                  <Bell size={16} className="text-frigus-primary" />
                  <div>
                    <p className="text-xs font-bold text-frigus-navy">
                      Notificações por e-mail
                    </p>
                    <p className="text-[10px] text-gray-400">
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

              <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-3">
                  <Shield size={16} className="text-emerald-600" />
                  <div>
                    <p className="text-xs font-bold text-frigus-navy">
                      Alertas de estoque
                    </p>
                    <p className="text-[10px] text-gray-400">
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
          <div className="bg-frigus-navy text-white rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-bold text-frigus-ice uppercase tracking-wider block">
                Assinatura
              </span>
              <h3 className="font-montserrat font-bold text-lg mt-1">
                Plano Doméstico Gratuito
              </h3>
              <p className="text-xs text-frigus-ice/80 mt-1 leading-relaxed">
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

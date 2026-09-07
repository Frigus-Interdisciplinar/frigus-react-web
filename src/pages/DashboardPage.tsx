import { Link } from "react-router-dom";
import { ChevronRight, ArrowRight, Check } from "lucide-react";
import AppLayout from "@/components/Layout/AppLayout";
import Badge from "@/components/Common/Badge";

export default function DashboardPage() {
  return (
    <AppLayout activeSection="home">
      <div className="space-y-6">
        {/* Cabeçalho de Boas-Vindas */}
        <div>
          <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-frigus-navy">
            Bom dia, Henrique
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-sans">
            Uma visão clara para aproveitar melhor cada item
          </p>
        </div>

        {/* Linha Superior: Hero Card + Card Para Usar Primeiro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Hero Banner (8 colunas) */}
          <div className="lg:col-span-8 bg-frigus-primary rounded-3xl p-6 md:p-8 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            {/* Círculos decorativos de fundo */}
            <div className="absolute right-40 -top-10 w-48 h-48 rounded-full bg-frigus-accent/30 pointer-events-none blur-xl" />
            <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-frigus-ice/20 pointer-events-none blur-lg" />

            <div className="relative z-10 space-y-3 max-w-md">
              <span className="text-[11px] uppercase tracking-wider font-bold text-frigus-ice font-sans">
                Sua casa hoje
              </span>
              <h2 className="font-montserrat font-bold text-2xl md:text-[26px] leading-tight">
                3 itens pedem atenção
              </h2>
              <p className="text-frigus-ice text-sm font-sans leading-relaxed">
                Você ainda consegue usá-los antes da validade.
              </p>
              <div className="pt-2">
                <Link
                  to="/alerts"
                  className="inline-flex items-center gap-2 bg-frigus-accent hover:bg-[#F2BD50] text-frigus-navy px-4 py-2 rounded-xl text-xs font-bold transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Ver itens</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* Insight Card interno */}
            <div className="relative z-10 w-full md:w-56 bg-frigus-navy/90 backdrop-blur-xs rounded-2xl p-4 border border-white/10 flex flex-col justify-between shrink-0 shadow-lg">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-frigus-ice">
                  Estoque em dia
                </span>
                <div className="font-montserrat font-bold text-3xl text-white mt-1">
                  72%
                </div>
                <span className="text-xs text-frigus-ice/80">dos itens sem alerta</span>
              </div>

              {/* Sparkline bars */}
              <div className="flex items-end gap-1.5 h-10 mt-4 pt-1">
                <div className="w-2.5 h-4 bg-frigus-ice rounded-xs" />
                <div className="w-2.5 h-7 bg-frigus-ice rounded-xs" />
                <div className="w-2.5 h-5 bg-frigus-ice rounded-xs" />
                <div className="w-2.5 h-10 bg-frigus-accent rounded-xs" />
                <div className="w-2.5 h-7 bg-frigus-ice rounded-xs" />
              </div>
            </div>
          </div>

          {/* Para usar primeiro (4 colunas) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h3 className="font-montserrat font-bold text-frigus-navy text-base">
                Para usar primeiro
              </h3>
              <Link
                to="/alerts"
                className="text-xs font-bold text-frigus-primary hover:underline"
              >
                Ver todos
              </Link>
            </div>

            <div className="h-px bg-gray-100 my-4" />

            <div className="space-y-4">
              {/* Item 1 */}
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-red-400 rounded-full" />
                  <div>
                    <h4 className="text-sm font-bold text-frigus-navy group-hover:text-frigus-primary transition-colors">
                      Iogurte natural
                    </h4>
                    <p className="text-xs text-gray-400">Geladeira · 2 un.</p>
                  </div>
                </div>
                <Badge variant="danger">Hoje</Badge>
              </div>

              {/* Item 2 */}
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-frigus-accent rounded-full" />
                  <div>
                    <h4 className="text-sm font-bold text-frigus-navy group-hover:text-frigus-primary transition-colors">
                      Pão integral
                    </h4>
                    <p className="text-xs text-gray-400">Despensa · 1 un.</p>
                  </div>
                </div>
                <Badge variant="warning">Amanhã</Badge>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
              <span>Evite desperdícios na despensa</span>
              <ArrowRight size={14} className="text-gray-300" />
            </div>
          </div>
        </div>

        {/* Linha Intermediária: Consumo da Semana + Distribuição + Próxima Compra */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Consumo da Semana (5 colunas) */}
          <div className="md:col-span-5 bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-montserrat font-bold text-frigus-navy text-base">
                  Consumo da semana
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Itens retirados do estoque
                </p>
              </div>
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-[#EAF3FF] text-frigus-primary">
                18 itens usados
              </span>
            </div>

            {/* Gráfico de Barras */}
            <div className="mt-6">
              <div className="relative h-32 flex items-end justify-between px-4 pb-6 border-b border-gray-100">
                {/* Linhas de referência sutis */}
                <div className="absolute inset-x-0 top-2 border-t border-dashed border-gray-100" />
                <div className="absolute inset-x-0 top-14 border-t border-dashed border-gray-100" />

                {/* Barras por dia */}
                {[
                  { day: "S", h: "35%", color: "bg-frigus-primary" },
                  { day: "T", h: "65%", color: "bg-frigus-primary" },
                  { day: "Q", h: "50%", color: "bg-frigus-primary" },
                  { day: "Q", h: "80%", color: "bg-frigus-secondary" },
                  { day: "S", h: "55%", color: "bg-frigus-primary" },
                  { day: "S", h: "90%", color: "bg-frigus-ice" },
                  { day: "D", h: "70%", color: "bg-frigus-primary" },
                ].map((col, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center gap-2 relative z-10 w-7"
                  >
                    <div
                      className={`w-full ${col.color} rounded-lg transition-all duration-300 hover:brightness-110`}
                      style={{ height: col.h }}
                    />
                    <span className="text-[11px] font-medium text-gray-400">
                      {col.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Distribuição do Estoque (3 colunas) */}
          <div className="md:col-span-3 bg-frigus-navy text-white rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-frigus-ice">
                Distribuição
              </span>
              <h3 className="font-montserrat font-bold text-white text-base mt-0.5">
                Seu estoque
              </h3>
            </div>

            {/* Donut central simples com CSS */}
            <div className="my-4 flex items-center justify-center">
              <div className="relative w-28 h-28 rounded-full border-8 border-frigus-ice flex items-center justify-center border-t-frigus-primary border-r-frigus-accent border-l-[#6D91EA]">
                <div className="text-center">
                  <span className="font-montserrat font-bold text-2xl text-white block leading-none">
                    128
                  </span>
                  <span className="text-[10px] text-frigus-ice uppercase tracking-wider font-semibold">
                    itens
                  </span>
                </div>
              </div>
            </div>

            {/* Legenda */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-frigus-ice">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-frigus-ice" />
                  Despensa
                </span>
                <span className="font-bold text-white">46</span>
              </div>
              <div className="flex items-center justify-between text-frigus-ice">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-frigus-primary" />
                  Geladeira
                </span>
                <span className="font-bold text-white">31</span>
              </div>
              <div className="flex items-center justify-between text-frigus-ice">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-frigus-accent" />
                  Frescos
                </span>
                <span className="font-bold text-white">28</span>
              </div>
              <div className="flex items-center justify-between text-frigus-ice">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#6D91EA]" />
                  Congelados
                </span>
                <span className="font-bold text-white">23</span>
              </div>
            </div>
          </div>

          {/* Próxima Compra (4 colunas) */}
          <div className="md:col-span-4 bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                Próxima compra
              </span>
              <h3 className="font-montserrat font-bold text-frigus-navy text-base mt-0.5">
                Faltam 4 itens
              </h3>
            </div>

            {/* Lista com Checkboxes */}
            <div className="space-y-3 my-4">
              {[
                { name: "Ovos", qty: "12 un.", checked: false },
                { name: "Aveia", qty: "1 pct", checked: false },
                { name: "Sabão neutro", qty: "2 un.", checked: true },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                        item.checked
                          ? "bg-frigus-primary border-frigus-primary text-white"
                          : "border-gray-300"
                      }`}
                    >
                      {item.checked && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        item.checked ? "line-through text-gray-400" : "text-frigus-navy font-semibold"
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">
                    {item.qty}
                  </span>
                </div>
              ))}
            </div>

            <Link
              to="/shopping-list"
              className="w-full py-2.5 px-4 bg-frigus-navy hover:bg-slate-900 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 transition-colors"
            >
              <span>Abrir lista de compras</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* Linha Inferior: Últimas Atualizações (Tabela) */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
          <div className="mb-4">
            <h3 className="font-montserrat font-bold text-frigus-navy text-base">
              Últimas atualizações
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Seu estoque foi atualizado pelo aplicativo
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4">Quantidade</th>
                  <th className="py-3 px-4">Validade</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <tr className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-frigus-navy flex items-center gap-2.5">
                    <div className="w-1.5 h-4 bg-frigus-primary rounded-full" />
                    Leite
                  </td>
                  <td className="py-3.5 px-4 text-gray-500 text-xs">Laticínios</td>
                  <td className="py-3.5 px-4 text-gray-500 text-xs">2 un.</td>
                  <td className="py-3.5 px-4 text-gray-500 text-xs">14 nov.</td>
                  <td className="py-3.5 px-4 text-right">
                    <Badge variant="success">Em dia</Badge>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-frigus-navy flex items-center gap-2.5">
                    <div className="w-1.5 h-4 bg-frigus-ice rounded-full" />
                    Arroz integral
                  </td>
                  <td className="py-3.5 px-4 text-gray-500 text-xs">Despensa</td>
                  <td className="py-3.5 px-4 text-gray-500 text-xs">1 kg</td>
                  <td className="py-3.5 px-4 text-gray-500 text-xs">28 nov.</td>
                  <td className="py-3.5 px-4 text-right">
                    <Badge variant="success">Em dia</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

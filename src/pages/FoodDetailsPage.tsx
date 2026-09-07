import { Link, useParams } from "react-router-dom";
import {
  ChevronRight,
  Trash2,
  Edit,
  CheckCircle2,
  MinusCircle,
} from "lucide-react";
import AppLayout from "@/components/Layout/AppLayout";
import Badge from "@/components/Common/Badge";

export default function FoodDetailsPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <AppLayout activeSection="stock">
      <div className="space-y-6">
        {/* Breadcrumb e Ações */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mb-1">
              <Link to="/stock" className="hover:text-frigus-navy transition-colors">
                Meu estoque
              </Link>
              <ChevronRight size={12} />
              <span>Geladeira</span>
              <ChevronRight size={12} />
              <span className="text-frigus-navy font-semibold">Leite integral</span>
            </div>
            <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-frigus-navy">
              Detalhes do alimento
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors">
              <Trash2 size={15} />
              <span>Excluir</span>
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-frigus-primary hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs">
              <Edit size={15} />
              <span>Editar item</span>
            </button>
          </div>
        </div>

        {/* Card Principal de Destaque */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200/80 shadow-xs flex flex-col md:flex-row items-center gap-6">
          <div className="w-32 h-32 rounded-2xl bg-blue-50/50 p-2 flex items-center justify-center border border-blue-100/50 shrink-0">
            <img
              src="/images/food-leite.png"
              alt="Leite integral"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="space-y-3 flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <Badge variant="info">Laticínios</Badge>
              <Badge variant="success">Dentro do prazo</Badge>
            </div>
            <h2 className="font-montserrat font-bold text-2xl text-frigus-navy">
              Leite integral
            </h2>
            <p className="text-xs text-gray-400 font-medium">
              Marca: Fazenda Bela • ID: #{id || "1"}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Quantidade Disponível
                </span>
                <span className="font-montserrat font-bold text-lg text-frigus-navy">
                  2 L
                </span>
              </div>
              <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Armazenamento
                </span>
                <span className="font-montserrat font-bold text-lg text-frigus-navy">
                  Geladeira
                </span>
              </div>
              <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Status
                </span>
                <span className="font-montserrat font-bold text-base text-emerald-600">
                  Validade OK
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Seções em Grid: Informações + Validade e Consumo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Informações do Item (7 colunas) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
            <h3 className="font-montserrat font-bold text-frigus-navy text-base">
              Informações do item
            </h3>

            <div className="divide-y divide-gray-100 text-sm">
              {[
                { label: "CATEGORIA", value: "Laticínios" },
                { label: "MARCA", value: "Fazenda Bela" },
                { label: "UNIDADE DE MEDIDA", value: "Litro (L)" },
                { label: "QUANTIDADE", value: "2 L" },
                { label: "LOCAL", value: "Geladeira" },
                { label: "DATA DE VALIDADE", value: "18 de agosto de 2026" },
                { label: "CADASTRADO EM", value: "02 de agosto de 2026" },
                { label: "ÚLTIMA ATUALIZAÇÃO", value: "Hoje, 09:41" },
              ].map((row, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 tracking-wider">
                    {row.label}
                  </span>
                  <span className="font-semibold text-frigus-navy text-xs sm:text-sm">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Validade e Consumo (5 colunas) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Card de Validade */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
              <h3 className="font-montserrat font-bold text-frigus-navy text-base">
                Validade e consumo
              </h3>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white border border-emerald-200 flex flex-col items-center justify-center text-center shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-emerald-600">
                    AGO
                  </span>
                  <span className="font-montserrat font-bold text-xl text-frigus-navy leading-none">
                    18
                  </span>
                  <span className="text-[9px] text-gray-400">2026</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                    Dentro da validade
                  </span>
                  <p className="font-bold text-frigus-navy text-sm">Faltam 3 dias</p>
                  <p className="text-xs text-gray-500">
                    Consuma antes de 18 de agosto.
                  </p>
                </div>
              </div>

              <button className="w-full py-2.5 px-4 bg-frigus-navy hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors">
                Registrar consumo
              </button>
            </div>

            {/* Histórico de Consumo */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-3">
              <div>
                <h4 className="font-montserrat font-bold text-frigus-navy text-sm">
                  Histórico de consumo
                </h4>
                <p className="text-[11px] text-gray-400">
                  Movimentações dos últimos 30 dias
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                  <div className="flex items-center gap-2">
                    <MinusCircle size={15} className="text-amber-500" />
                    <div>
                      <p className="font-bold text-frigus-navy">Consumo de 500 ml</p>
                      <p className="text-[10px] text-gray-400">Ontem às 19:20</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-500">-500 ml</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-500" />
                    <div>
                      <p className="font-bold text-frigus-navy">Entrada no estoque</p>
                      <p className="text-[10px] text-gray-400">02 ago às 11:00</p>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-600">+2 L</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

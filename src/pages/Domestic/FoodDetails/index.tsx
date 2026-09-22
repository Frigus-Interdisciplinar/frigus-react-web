import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ChevronRight,
  Trash2,
  Edit,
  CheckCircle2,
  MinusCircle,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import Badge from "@/components/Badge";
import { EditFoodModal } from "@/components/Modal";
import type { FoodItemData } from "@/components/Modal/EditFoodModal";

export default function FoodDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [food, setFood] = useState<FoodItemData>({
    id: id || "1",
    name: "Leite integral",
    category: "Laticínios",
    location: "Geladeira",
    quantity: "2 L",
    expiration: "18 ago 2026",
  });

  const handleSave = (updated: FoodItemData) => {
    setFood(updated);
  };

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
              <span>{food.location}</span>
              <ChevronRight size={12} />
              <span className="text-frigus-navy font-semibold">{food.name}</span>
            </div>
            <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-frigus-navy">
              Detalhes do alimento
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer"
            >
              <Trash2 size={15} />
              <span>Excluir</span>
            </button>
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2552C8] hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
            >
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
              alt={food.name}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="space-y-3 flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <Badge variant="info">{food.category}</Badge>
              <Badge variant="success">Dentro do prazo</Badge>
            </div>
            <h2 className="font-montserrat font-bold text-2xl text-frigus-navy">
              {food.name}
            </h2>
            <p className="text-xs text-gray-400 font-medium">
              Marca: Fazenda Bela • ID: #{food.id || "1"}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Quantidade Disponível
                </span>
                <span className="font-montserrat font-bold text-lg text-frigus-navy">
                  {food.quantity}
                </span>
              </div>
              <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Armazenamento
                </span>
                <span className="font-montserrat font-bold text-lg text-frigus-navy">
                  {food.location}
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
              Informações do produto
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 font-medium block">Espaço na casa</span>
                <span className="font-bold text-frigus-navy mt-0.5 block">{food.location}</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium block">Categoria</span>
                <span className="font-bold text-frigus-navy mt-0.5 block">{food.category}</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium block">Data de entrada</span>
                <span className="font-bold text-frigus-navy mt-0.5 block">02 ago 2026</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium block">Data de validade</span>
                <span className="font-bold text-frigus-navy mt-0.5 block">{food.expiration}</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium block">Código de barras</span>
                <span className="font-bold text-frigus-navy mt-0.5 block">7891000315507</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium block">Cadastrado por</span>
                <span className="font-bold text-frigus-navy mt-0.5 block">Henrique Paulo</span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-400 font-medium block mb-1">
                Observações
              </span>
              <p className="text-xs text-gray-600 font-sans leading-relaxed">
                Manter sempre refrigerado entre 2°C e 8°C. Após aberto, consumir em até 3 dias.
              </p>
            </div>
          </div>

          {/* Validade e Histórico de Consumo (5 colunas) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Card de Alerta de Validade */}
            <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-200 text-emerald-950 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <h4 className="font-montserrat font-bold text-sm text-emerald-900">
                  Dentro do prazo de validade
                </h4>
              </div>
              <p className="text-xs text-emerald-800 font-sans leading-relaxed">
                Este item tem validade até {food.expiration}. Não há risco imediato de perda.
              </p>
            </div>

            {/* Histórico Recente de Consumo */}
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

      {/* Modal Dedicado de Editar Alimento (Figma 1879:4658) */}
      <EditFoodModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={food}
        onSave={handleSave}
      />
    </AppLayout>
  );
}

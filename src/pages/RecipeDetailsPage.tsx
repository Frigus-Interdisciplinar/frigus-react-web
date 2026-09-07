import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Bookmark,
  Clock,
  Users,
  ChefHat,
  Check,
  AlertCircle,
} from "lucide-react";
import AppLayout from "@/components/Layout/AppLayout";
import Badge from "@/components/Common/Badge";

export default function RecipeDetailsPage() {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <AppLayout activeSection="recipe">
      <div className="space-y-6">
        {/* Breadcrumb e Ação */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mb-1">
              <Link to="/recipe" className="hover:text-frigus-navy transition-colors">
                Receitas
              </Link>
              <ChevronRight size={12} />
              <span>Café da manhã</span>
              <ChevronRight size={12} />
              <span className="text-frigus-navy font-semibold">Omelete de tomate</span>
            </div>
            <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-frigus-navy">
              Omelete de tomate
            </h1>
          </div>

          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all shadow-xs ${
              isSaved
                ? "bg-amber-50 border-amber-200 text-amber-700"
                : "bg-white border-gray-200 text-frigus-navy hover:bg-gray-50"
            }`}
          >
            <Bookmark size={15} className={isSaved ? "fill-amber-500" : ""} />
            <span>{isSaved ? "Salva" : "Salvar"}</span>
          </button>
        </div>

        {/* Hero Card da Receita com Imagem e Informações */}
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-200/80 shadow-xs">
          <div className="h-64 sm:h-80 w-full relative">
            <img
              src="/images/omelete.png"
              alt="Omelete de tomate"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6 sm:p-8">
              <div className="space-y-2 text-white">
                <div className="flex items-center gap-2">
                  <Badge variant="accent">Café da manhã</Badge>
                  <span className="text-xs bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full text-white font-medium">
                    15 minutos
                  </span>
                </div>
                <h2 className="font-montserrat font-bold text-2xl sm:text-3xl text-white">
                  Omelete de tomate
                </h2>
                <p className="text-sm text-gray-200 max-w-xl font-sans leading-relaxed">
                  Uma omelete rápida, leve e perfeita para usar os tomates que estão na geladeira.
                </p>
              </div>
            </div>
          </div>

          {/* Faixa de Métricas e Disponibilidade */}
          <div className="p-6 bg-gray-50/50 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-3.5 rounded-2xl border border-gray-200/60 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-frigus-primary">
                <Clock size={18} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Tempo
                </span>
                <span className="font-montserrat font-bold text-sm text-frigus-navy">
                  15 min
                </span>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-gray-200/60 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Users size={18} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Porções
                </span>
                <span className="font-montserrat font-bold text-sm text-frigus-navy">
                  2 pessoas
                </span>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-gray-200/60 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <ChefHat size={18} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Dificuldade
                </span>
                <span className="font-montserrat font-bold text-sm text-frigus-navy">
                  Fácil
                </span>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-blue-200/80 bg-blue-50/30 flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-frigus-primary uppercase tracking-wider block">
                  Ingredientes
                </span>
                <span className="font-montserrat font-bold text-sm text-frigus-navy">
                  4/5 disponíveis
                </span>
              </div>
              <Link
                to="/shopping-list"
                className="px-2.5 py-1.5 bg-frigus-primary text-white text-[11px] font-bold rounded-lg hover:bg-blue-700 transition-colors shrink-0"
              >
                + Comprar falta
              </Link>
            </div>
          </div>
        </div>

        {/* Ingredientes + Modo de Preparo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Ingredientes (5 colunas) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
            <div>
              <h3 className="font-montserrat font-bold text-frigus-navy text-base">
                Ingredientes
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Você já tem 4 de 5 itens em casa
              </p>
            </div>

            {/* Disponíveis */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase text-emerald-600 tracking-wider">
                Em casa
              </span>
              {[
                { name: "Ovos", qty: "2 unidades" },
                { name: "Tomate italiano", qty: "2 unidades" },
                { name: "Leite integral", qty: "100 ml" },
                { name: "Queijo muçarela", qty: "40 g" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Check size={13} strokeWidth={3} />
                    </div>
                    <span className="text-xs font-bold text-frigus-navy">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{item.qty}</span>
                </div>
              ))}
            </div>

            {/* Em falta */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-bold uppercase text-amber-600 tracking-wider">
                Em falta
              </span>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/50 border border-amber-200/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center">
                    <AlertCircle size={13} />
                  </div>
                  <span className="text-xs font-bold text-frigus-navy">
                    Salsinha
                  </span>
                </div>
                <span className="text-xs text-amber-700 font-medium">a gosto</span>
              </div>
            </div>
          </div>

          {/* Modo de Preparo (7 colunas) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
            <div>
              <h3 className="font-montserrat font-bold text-frigus-navy text-base">
                Modo de preparo
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Siga os passos e aproveite o que já está em casa.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {[
                {
                  step: 1,
                  desc: "Corte os tomates em cubos pequenos e reserve.",
                },
                {
                  step: 2,
                  desc: "Bata os ovos com o leite, sal e pimenta a gosto.",
                },
                {
                  step: 3,
                  desc: "Aqueça uma frigideira, adicione tomate e despeje a mistura.",
                },
                {
                  step: 4,
                  desc: "Finalize com queijo e salsinha. Dobre e sirva em seguida.",
                },
              ].map((s) => (
                <div
                  key={s.step}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100"
                >
                  <div className="w-8 h-8 rounded-xl bg-frigus-navy text-white font-montserrat font-bold text-sm flex items-center justify-center shrink-0">
                    {s.step}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed pt-1">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

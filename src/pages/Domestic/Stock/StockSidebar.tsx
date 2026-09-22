import { Link } from "react-router-dom";
import { ArrowRight, AlertCircle } from "lucide-react";

export type CategoryStat = {
  name: string;
  count: number;
  color: string;
  percentage: number;
};

const defaultStats: CategoryStat[] = [
  { name: "Despensa", count: 46, color: "#2552C8", percentage: 80 },
  { name: "Geladeira", count: 31, color: "#6D91EA", percentage: 55 },
  { name: "Frutas e verduras", count: 28, color: "#2D9C6B", percentage: 48 },
  { name: "Congelados", count: 23, color: "#E1A11B", percentage: 40 },
];

export type StockSidebarProps = {
  stats?: CategoryStat[];
  onFilterExpired?: () => void;
};

export default function StockSidebar({
  stats = defaultStats,
  onFilterExpired,
}: StockSidebarProps) {
  return (
    <div className="w-full lg:w-[336px] flex flex-col gap-6 shrink-0">
      {/* Card: Como está o seu estoque */}
      <div className="bg-white rounded-2xl border border-[#E4EAF2] p-6 shadow-2xs">
        <div className="mb-4">
          <h3 className="font-montserrat font-bold text-base text-[#131C55]">
            Como está o seu estoque
          </h3>
          <p className="text-xs text-[#758198] mt-0.5">
            Quantidade de itens por categoria
          </p>
        </div>

        <div className="space-y-4">
          {stats.map((stat) => (
            <div key={stat.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-[#172033]">
                <span>{stat.name}</span>
                <span className="text-[11px] font-normal text-[#758198]">
                  {stat.count} itens
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#F5F8FC] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${stat.percentage}%`,
                    backgroundColor: stat.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card: Organize o estoque */}
      <div className="bg-white rounded-2xl border border-[#E4EAF2] p-6 shadow-2xs flex flex-col justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle size={18} className="text-[#2552C8]" />
            <h3 className="font-montserrat font-bold text-base text-[#131C55]">
              Organize o estoque
            </h3>
          </div>
          <p className="text-xs text-[#758198] leading-relaxed">
            Revise os itens vencidos e mantenha a casa em dia.
          </p>
        </div>

        {onFilterExpired ? (
          <button
            type="button"
            onClick={onFilterExpired}
            className="w-full h-11 px-4 rounded-xl bg-[#C9DEF9] hover:bg-[#b8d4f7] text-[#131C55] font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
          >
            <span>Ver produtos vencidos</span>
            <ArrowRight size={15} />
          </button>
        ) : (
          <Link
            to="/alerts"
            className="w-full h-11 px-4 rounded-xl bg-[#C9DEF9] hover:bg-[#b8d4f7] text-[#131C55] font-bold text-xs flex items-center justify-between transition-colors"
          >
            <span>Ver produtos vencidos</span>
            <ArrowRight size={15} />
          </Link>
        )}
      </div>
    </div>
  );
}

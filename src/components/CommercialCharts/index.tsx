// 1. Gráfico de Compras ao longo do mês (Gastos e Compras - Figma 1879:1752)
export function WeeklySpendingChart() {
  const data = [
    { week: "01–07 ago", value: 3420, height: "48%" },
    { week: "08–14 ago", value: 4820, height: "68%" },
    { week: "15–21 ago", value: 3940, height: "55%" },
    { week: "22–31 ago", value: 6240, height: "88%" },
  ];

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-end justify-between gap-4 h-48 pt-6 pb-2 border-b border-gray-100 relative">
        {/* Linhas de grade e valores no eixo Y */}
        <div className="absolute inset-x-0 top-6 border-b border-dashed border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
          <span>7 mil</span>
        </div>
        <div className="absolute inset-x-0 top-24 border-b border-dashed border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
          <span>3,5 mil</span>
        </div>
        <div className="absolute inset-x-0 bottom-2 border-b border-gray-200 flex items-center justify-between text-[10px] text-gray-400">
          <span>0</span>
        </div>

        {/* Barras */}
        <div className="flex-1 flex items-end justify-around h-full z-10 pl-8">
          {data.map((item) => (
            <div key={item.week} className="flex flex-col items-center gap-1.5 h-full justify-end group">
              <span className="text-[11px] font-bold text-[#141C55] opacity-0 group-hover:opacity-100 transition-opacity">
                R$ {item.value.toLocaleString("pt-BR")}
              </span>
              <div
                style={{ height: item.height }}
                className="w-12 bg-linear-to-t from-[#2552C8] to-[#467bf7] rounded-t-xl transition-all duration-300 group-hover:brightness-110 shadow-xs"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Rótulos eixo X */}
      <div className="flex justify-around pl-8 text-xs font-medium text-gray-500">
        {data.map((item) => (
          <span key={item.week}>{item.week}</span>
        ))}
      </div>
    </div>
  );
}

// 2. Gráfico de Tendência de Desperdícios (Figma 1879:1666)
export function WasteTrendChart() {
  const data = [
    { week: "01–07 ago", value: 28, height: "82%" },
    { week: "08–14 ago", value: 24, height: "70%" },
    { week: "15–21 ago", value: 19, height: "55%" },
    { week: "22–31 ago", value: 15, height: "44%" },
  ];

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-end justify-between gap-4 h-48 pt-6 pb-2 border-b border-gray-100 relative">
        {/* Linha da meta */}
        <div className="absolute inset-x-0 top-[52%] border-b-2 border-dashed border-amber-400 z-0">
          <span className="absolute right-0 -top-4 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
            Meta: 18,5 kg / período
          </span>
        </div>

        {/* Barras de volume descartado */}
        <div className="flex-1 flex items-end justify-around h-full z-10 pl-6">
          {data.map((item) => (
            <div key={item.week} className="flex flex-col items-center gap-1.5 h-full justify-end group">
              <span className="text-[11px] font-bold text-[#141C55]">
                {item.value} kg
              </span>
              <div
                style={{ height: item.height }}
                className="w-12 bg-linear-to-t from-red-500 to-rose-400 rounded-t-xl transition-all duration-300 group-hover:brightness-110 shadow-xs"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Rótulos eixo X */}
      <div className="flex justify-around pl-6 text-xs font-medium text-gray-500">
        {data.map((item) => (
          <span key={item.week}>{item.week}</span>
        ))}
      </div>
    </div>
  );
}

// 3. Gráfico Donut de Motivos de Desperdício (Figma 1879:1666)
export function WasteDonutChart() {
  return (
    <div className="flex items-center gap-6">
      {/* SVG Donut */}
      <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {/* Segmento 1: Validade expirada 50% (red) */}
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="transparent"
            stroke="#EF4444"
            strokeWidth="14"
            strokeDasharray="119.38 238.76"
            strokeDashoffset="0"
          />
          {/* Segmento 2: Manuseio 25% (amber) */}
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="transparent"
            stroke="#F59E0B"
            strokeWidth="14"
            strokeDasharray="59.69 238.76"
            strokeDashoffset="-119.38"
          />
          {/* Segmento 3: Transporte 15% (blue) */}
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="transparent"
            stroke="#3B82F6"
            strokeWidth="14"
            strokeDasharray="35.81 238.76"
            strokeDashoffset="-179.07"
          />
          {/* Segmento 4: Excesso de preparo 10% (purple) */}
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="transparent"
            stroke="#8B5CF6"
            strokeWidth="14"
            strokeDasharray="23.88 238.76"
            strokeDashoffset="-214.88"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-base font-bold text-[#141C55] leading-tight">86 kg</span>
          <span className="text-[10px] text-gray-400">descartados</span>
        </div>
      </div>

      {/* Legenda dos Motivos */}
      <div className="flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-gray-600">Validade expirada</span>
          </div>
          <span className="font-bold text-[#141C55]">50%</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-gray-600">Manuseio</span>
          </div>
          <span className="font-bold text-[#141C55]">25%</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-gray-600">Transporte</span>
          </div>
          <span className="font-bold text-[#141C55]">15%</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span className="text-gray-600">Excesso de preparo</span>
          </div>
          <span className="font-bold text-[#141C55]">10%</span>
        </div>
      </div>
    </div>
  );
}

// 4. Gráfico de Movimentações de Estoque - Entradas vs Saídas (Relatório Mensal - Figma 1879:1384)
export function StockFlowChart() {
  const data = [
    { week: "01–07 ago", inQty: 85, outQty: 62 },
    { week: "08–14 ago", inQty: 92, outQty: 74 },
    { week: "15–21 ago", inQty: 78, outQty: 80 },
    { week: "22–31 ago", inQty: 96, outQty: 68 },
  ];

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-end gap-5 mb-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-[#2552C8]" />
          <span className="text-gray-600 font-medium">Entradas</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-[#70A2D7]" />
          <span className="text-gray-600 font-medium">Saídas</span>
        </div>
      </div>

      <div className="flex items-end justify-between gap-4 h-48 pt-6 pb-2 border-b border-gray-100 relative">
        <div className="absolute inset-x-0 top-6 border-b border-dashed border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
          <span>100</span>
        </div>
        <div className="absolute inset-x-0 top-24 border-b border-dashed border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
          <span>50</span>
        </div>
        <div className="absolute inset-x-0 bottom-2 border-b border-gray-200 flex items-center justify-between text-[10px] text-gray-400">
          <span>0</span>
        </div>

        <div className="flex-1 flex items-end justify-around h-full z-10 pl-6">
          {data.map((item) => (
            <div key={item.week} className="flex items-end gap-2 h-full justify-center">
              <div
                style={{ height: `${(item.inQty / 100) * 100}%` }}
                className="w-6 bg-[#2552C8] rounded-t-md shadow-xs"
                title={`Entradas: ${item.inQty}`}
              />
              <div
                style={{ height: `${(item.outQty / 100) * 100}%` }}
                className="w-6 bg-[#70A2D7] rounded-t-md shadow-xs"
                title={`Saídas: ${item.outQty}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-around pl-6 text-xs font-medium text-gray-500">
        {data.map((item) => (
          <span key={item.week}>{item.week}</span>
        ))}
      </div>
    </div>
  );
}

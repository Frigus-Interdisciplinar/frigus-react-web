// 1. WeeklyViewsChart (Visualizações e cliques por semana)
export function WeeklyViewsChart() {
  const points = [
    { day: "03", views: 42, clicks: 18 },
    { day: "06", views: 58, clicks: 24 },
    { day: "09", views: 76, clicks: 35 },
    { day: "12", views: 64, clicks: 28 },
    { day: "15", views: 88, clicks: 42 },
    { day: "18", views: 94, clicks: 48 },
    { day: "21", views: 82, clicks: 38 },
    { day: "24", views: 106, clicks: 54 },
  ];

  const maxVal = 120;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-6 justify-end text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#2552C8]" />
          <span className="text-[#64748B] dark:text-neutral-400 font-medium">Visualizações</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400" />
          <span className="text-[#64748B] dark:text-neutral-400 font-medium">Cliques</span>
        </div>
      </div>

      <div className="h-48 flex items-end justify-between gap-3 pt-4 border-b border-[#E1E7F0] dark:border-[#343941]">
        {points.map((p, idx) => {
          const viewsHeight = `${(p.views / maxVal) * 100}%`;
          const clicksHeight = `${(p.clicks / maxVal) * 100}%`;

          return (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
              <div className="w-full flex items-end justify-center gap-1.5 h-full">
                {/* Views Bar */}
                <div
                  style={{ height: viewsHeight }}
                  className="w-3.5 bg-linear-to-t from-[#2552C8] to-[#467bf7] rounded-t-md transition-all duration-300 group-hover:brightness-110 relative"
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 bg-[#141C55] dark:bg-white text-white dark:text-[#141C55] text-[10px] font-bold py-0.5 px-1.5 rounded pointer-events-none whitespace-nowrap z-20 shadow-md">
                    {p.views}k
                  </div>
                </div>

                {/* Clicks Bar */}
                <div
                  style={{ height: clicksHeight }}
                  className="w-3.5 bg-linear-to-t from-cyan-500 to-cyan-300 rounded-t-md transition-all duration-300 group-hover:brightness-110 relative"
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 bg-[#141C55] dark:bg-white text-white dark:text-[#141C55] text-[10px] font-bold py-0.5 px-1.5 rounded pointer-events-none whitespace-nowrap z-20 shadow-md">
                    {p.clicks}k
                  </div>
                </div>
              </div>

              <span className="text-[11px] font-semibold text-[#64748B] dark:text-neutral-400 mt-2.5">
                {p.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 2. ViewsByPeriodChart (Visitas por período: 01, 03, 05, 07, 09)
export function ViewsByPeriodChart() {
  const data = [
    { period: "01", value: 38 },
    { period: "03", value: 65 },
    { period: "05", value: 84 },
    { period: "07", value: 92 },
    { period: "09", value: 110 },
  ];

  const max = 120;

  return (
    <div className="w-full space-y-4">
      <div className="h-44 flex items-end justify-between gap-4 pt-4 border-b border-[#E1E7F0] dark:border-[#343941]">
        {data.map((d, idx) => {
          const height = `${(d.value / max) * 100}%`;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
              <div
                style={{ height }}
                className="w-10 bg-linear-to-t from-[#2552C8] to-[#60a5fa] rounded-t-xl transition-all duration-300 group-hover:brightness-110 relative"
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 bg-[#141C55] dark:bg-white text-white dark:text-[#141C55] text-[10px] font-bold py-0.5 px-2 rounded pointer-events-none whitespace-nowrap z-20 shadow-md">
                  {d.value}k visitas
                </div>
              </div>
              <span className="text-xs font-semibold text-[#64748B] dark:text-neutral-400 mt-2.5">
                Semana {d.period}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 3. AgeDemographicsChart (Faixa etária: 18-24 anos 32%, 25-34 anos 41%, 35-44 anos 18%, 45+ anos 9%)
export function AgeDemographicsChart() {
  const demographics = [
    { label: "18–24 anos", percentage: 32, color: "bg-blue-500" },
    { label: "25–34 anos", percentage: 41, color: "bg-[#2552C8]" },
    { label: "35–44 anos", percentage: 18, color: "bg-indigo-500" },
    { label: "45+ anos", percentage: 9, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-4">
      {demographics.map((item, idx) => (
        <div key={idx} className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-[#141C55] dark:text-white">{item.label}</span>
            <span className="text-[#64748B] dark:text-neutral-300 font-bold">
              {item.percentage}%
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-[#F5F8FC] dark:bg-[#252A32] overflow-hidden">
            <div
              style={{ width: `${item.percentage}%` }}
              className={`h-full ${item.color} rounded-full transition-all duration-500`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// 4. RegionsChart (Alcance por região: SP 42%, RJ 21%, MG 16%, PR 9%, Outros 12%)
export function RegionsChart() {
  const regions = [
    { name: "São Paulo", percentage: 42, color: "bg-[#2552C8]" },
    { name: "Rio de Janeiro", percentage: 21, color: "bg-blue-600" },
    { name: "Minas Gerais", percentage: 16, color: "bg-cyan-600" },
    { name: "Paraná", percentage: 9, color: "bg-teal-500" },
    { name: "Outros estados", percentage: 12, color: "bg-slate-400" },
  ];

  return (
    <div className="space-y-4">
      {regions.map((reg, idx) => (
        <div key={idx} className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-[#141C55] dark:text-white">{reg.name}</span>
            <span className="text-[#64748B] dark:text-neutral-300 font-bold">
              {reg.percentage}%
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-[#F5F8FC] dark:bg-[#252A32] overflow-hidden">
            <div
              style={{ width: `${reg.percentage}%` }}
              className={`h-full ${reg.color} rounded-full transition-all duration-500`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

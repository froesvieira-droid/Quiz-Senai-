import React from "react";

interface DiagramRendererProps {
  type?: string;
  equation?: string;
  tableData?: { headers: string[]; rows: string[][] };
}

export const DiagramRenderer: React.FC<DiagramRendererProps> = ({ type, equation, tableData }) => {
  return (
    <div className="my-4 flex flex-col items-center justify-center">
      {/* Table Data if exists */}
      {tableData && (
        <div className="w-full max-w-lg overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-xs font-bold text-slate-700 uppercase">
              <tr>
                {tableData.headers.map((h, i) => (
                  <th key={i} className="px-4 py-2.5 border-b border-slate-200">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {tableData.rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-4 py-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SVG Diagrams */}
      {type === "venn-diagram" && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 max-w-md w-full text-center">
          <svg viewBox="0 0 360 220" className="w-full h-auto max-h-56 mx-auto">
            {/* Universo C */}
            <rect x="10" y="10" width="340" height="200" rx="12" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
            <text x="25" y="32" className="text-xs font-bold fill-slate-700">C (Total de pessoas no local)</text>
            
            {/* Conjunto A: Intolerantes */}
            <circle cx="130" cy="115" r="65" fill="#ffffff" stroke="#0284c7" strokeWidth="2.5" />
            <text x="95" y="120" className="text-sm font-bold fill-sky-800">A (Lactose)</text>
            
            {/* Conjunto B: Vegetarianos */}
            <circle cx="215" cy="115" r="65" fill="#ffffff" stroke="#16a34a" strokeWidth="2.5" />
            <text x="220" y="120" className="text-sm font-bold fill-emerald-800">B (Veg.)</text>
            
            {/* Região externa destacada (quem pode comer a torta) */}
            <text x="180" y="195" textAnchor="middle" className="text-xs font-semibold fill-slate-600">
              Área cinza: pessoas SEM restrições (fora de A e B)
            </text>
          </svg>
          <span className="text-xs text-slate-500 mt-2 block">
            Figura ilustrativa: O conjunto que pode consumir frango com lactose está na região cinza fora de A e B.
          </span>
        </div>
      )}

      {type === "pie-chart-sugarcane" && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 max-w-md w-full shadow-xs">
          <h4 className="text-xs font-bold text-center text-slate-700 uppercase tracking-wider mb-2">
            Participação na Produção de Cana-de-Açúcar (2022)
          </h4>
          <svg viewBox="0 0 320 200" className="w-full h-auto max-h-52 mx-auto">
            {/* Pie segments visualization */}
            <circle cx="100" cy="100" r="75" fill="#3b82f6" />
            {/* Goiás 11.9% */}
            <path d="M 100 100 L 100 25 A 75 75 0 0 1 155 49 Z" fill="#10b981" />
            {/* Minas Gerais 11.8% */}
            <path d="M 100 100 L 155 49 A 75 75 0 0 1 175 100 Z" fill="#f59e0b" />
            {/* Mato Grosso do Sul 7.6% */}
            <path d="M 100 100 L 175 100 A 75 75 0 0 1 169 135 Z" fill="#8b5cf6" />
            {/* Paraná 5.5% */}
            <path d="M 100 100 L 169 135 A 75 75 0 0 1 150 157 Z" fill="#ec4899" />
            {/* Demais Estados 13.0% (Highlight) */}
            <path d="M 100 100 L 150 157 A 75 75 0 0 1 100 175 Z" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
            
            {/* Legend */}
            <g transform="translate(195, 25)" className="text-[11px] font-medium fill-slate-700">
              <rect x="0" y="0" width="10" height="10" rx="2" fill="#3b82f6" />
              <text x="16" y="9">SP: 50,2%</text>

              <rect x="0" y="22" width="10" height="10" rx="2" fill="#10b981" />
              <text x="16" y="31">GO: 11,9%</text>

              <rect x="0" y="44" width="10" height="10" rx="2" fill="#f59e0b" />
              <text x="16" y="53">MG: 11,8%</text>

              <rect x="0" y="66" width="10" height="10" rx="2" fill="#8b5cf6" />
              <text x="16" y="75">MS: 7,6%</text>

              <rect x="0" y="88" width="10" height="10" rx="2" fill="#ec4899" />
              <text x="16" y="97">PR: 5,5%</text>

              <rect x="0" y="110" width="10" height="10" rx="2" fill="#ef4444" stroke="#b91c1c" />
              <text x="16" y="119" className="font-bold fill-red-600">Demais: 13,0%</text>
            </g>
          </svg>
          <p className="text-xs text-center text-slate-500 mt-1">Total Brasil: 630.128,8 mil toneladas</p>
        </div>
      )}

      {type === "bookshelf-diagram" && (
        <div className="rounded-xl border border-slate-200 bg-amber-50/50 p-4 max-w-sm w-full text-center">
          <svg viewBox="0 0 280 200" className="w-full h-auto max-h-48 mx-auto">
            {/* Floor */}
            <line x1="20" y1="180" x2="260" y2="180" stroke="#78350f" strokeWidth="4" />
            <text x="230" y="195" className="text-[10px] font-bold fill-amber-900">PISO</text>
            
            {/* Shelves (horizontal) */}
            <line x1="60" y1="30" x2="220" y2="30" stroke="#b45309" strokeWidth="3" />
            <line x1="50" y1="65" x2="230" y2="65" stroke="#b45309" strokeWidth="3" />
            <line x1="40" y1="105" x2="240" y2="105" stroke="#b45309" strokeWidth="3" />
            <line x1="30" y1="145" x2="250" y2="145" stroke="#b45309" strokeWidth="3" />
            
            {/* Supports transversais AE and FJ */}
            <line x1="70" y1="20" x2="35" y2="180" stroke="#0284c7" strokeWidth="3.5" strokeDasharray="4 2" />
            <line x1="210" y1="20" x2="245" y2="180" stroke="#0284c7" strokeWidth="3.5" strokeDasharray="4 2" />
            
            {/* Labels */}
            <text x="60" y="18" className="text-xs font-bold fill-sky-700">A</text>
            <text x="25" y="190" className="text-xs font-bold fill-sky-700">E</text>
            <text x="215" y="18" className="text-xs font-bold fill-sky-700">F</text>
            <text x="250" y="190" className="text-xs font-bold fill-sky-700">J</text>
            
            <text x="40" y="48" className="text-[10px] fill-slate-700 font-semibold">a=15</text>
            <text x="32" y="85" className="text-[10px] fill-slate-700 font-semibold">b=30</text>
            <text x="20" y="125" className="text-[10px] fill-slate-700 font-semibold">c=45</text>
          </svg>
          <span className="text-xs text-slate-600 block mt-1 font-medium">Suporte transversal AE e FJ com divisões proporcionais</span>
        </div>
      )}

      {type === "right-triangle-trig" && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 max-w-sm w-full text-center">
          <svg viewBox="0 0 280 180" className="w-full h-auto max-h-44 mx-auto">
            {/* Triangle ABC */}
            <polygon points="40,150 240,150 240,40" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2.5" />
            {/* Right angle marker at A (240, 150) */}
            <rect x="225" y="135" width="15" height="15" fill="none" stroke="#0369a1" strokeWidth="2" />
            <circle cx="232" cy="142" r="2" fill="#0369a1" />
            
            {/* Labels */}
            <text x="30" y="155" className="text-xs font-bold fill-slate-800">C</text>
            <text x="248" y="155" className="text-xs font-bold fill-slate-800">A</text>
            <text x="248" y="38" className="text-xs font-bold fill-slate-800">B</text>
            
            {/* Angle alpha at C */}
            <path d="M 80 150 A 40 40 0 0 0 74 135" fill="none" stroke="#ef4444" strokeWidth="2" />
            <text x="86" y="142" className="text-xs font-bold fill-red-600">α = 30°</text>
            
            {/* Side AC = 16 cm */}
            <text x="130" y="170" textAnchor="middle" className="text-xs font-bold fill-slate-700">AC = 16 cm (adjacente)</text>
            {/* Side AB = ? */}
            <text x="255" y="95" className="text-xs font-bold fill-sky-700">AB = ?</text>
          </svg>
          <span className="text-xs text-slate-500 block mt-1">tan(30°) = Cateto Oposto (AB) / Cateto Adjacente (AC)</span>
        </div>
      )}

      {type === "cable-car-pythagoras" && (
        <div className="rounded-xl border border-slate-200 bg-emerald-50/50 p-4 max-w-md w-full text-center">
          <svg viewBox="0 0 320 180" className="w-full h-auto max-h-44 mx-auto">
            {/* Sea level line */}
            <line x1="10" y1="160" x2="310" y2="160" stroke="#0284c7" strokeWidth="3" />
            <text x="20" y="175" className="text-[10px] font-bold fill-sky-800">Nível do mar (0 m)</text>
            
            {/* Mountain A (350m) */}
            <path d="M 20 160 L 70 30 L 120 160 Z" fill="#94a3b8" />
            {/* Mountain B (50m) */}
            <path d="M 210 160 L 260 135 L 305 160 Z" fill="#cbd5e1" />
            
            {/* Cable from A to B */}
            <line x1="70" y1="30" x2="260" y2="135" stroke="#ef4444" strokeWidth="3" strokeDasharray="3 3" />
            
            {/* Right triangle projection */}
            <line x1="70" y1="135" x2="260" y2="135" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 2" />
            <line x1="70" y1="30" x2="70" y2="135" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 2" />
            
            {/* Markers */}
            <circle cx="70" cy="30" r="5" fill="#ef4444" />
            <text x="70" y="20" className="text-xs font-bold fill-slate-900" textAnchor="middle">A (350m)</text>
            
            <circle cx="260" cy="135" r="5" fill="#ef4444" />
            <text x="260" y="125" className="text-xs font-bold fill-slate-900" textAnchor="middle">B (50m)</text>
            
            <text x="14" y="90" className="text-[11px] font-bold fill-slate-700">Δh = 300m</text>
            <text x="165" y="150" textAnchor="middle" className="text-[11px] font-bold fill-slate-700">d = 400m</text>
            <text x="175" y="75" className="text-xs font-black fill-red-600">Cabo AB = 500m</text>
          </svg>
        </div>
      )}

      {type === "income-pie-chart" && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 max-w-sm w-full text-center shadow-xs">
          <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">Distribuição da Renda Mensal</h4>
          <svg viewBox="0 0 280 180" className="w-full h-auto max-h-44 mx-auto">
            {/* Donut chart */}
            <circle cx="90" cy="90" r="60" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
            {/* Slices representation */}
            <path d="M 90 90 L 90 30 A 60 60 0 0 1 147 72 Z" fill="#3b82f6" />
            <path d="M 90 90 L 147 72 A 60 60 0 0 1 138 132 Z" fill="#10b981" />
            <path d="M 90 90 L 138 132 A 60 60 0 0 1 71 147 Z" fill="#f59e0b" />
            <path d="M 90 90 L 71 147 A 60 60 0 0 1 31 102 Z" fill="#8b5cf6" />
            <path d="M 90 90 L 31 102 A 60 60 0 0 1 90 30 Z" fill="#64748b" />
            
            {/* Legend */}
            <g transform="translate(165, 30)" className="text-[11px] font-medium fill-slate-700">
              <text x="0" y="10" className="font-bold fill-emerald-700">■ Alimentação: 30%</text>
              <text x="0" y="32" className="font-bold fill-blue-700">■ Moradia: 22%</text>
              <text x="0" y="54" className="fill-slate-600">■ Reserva: 20%</text>
              <text x="0" y="76" className="fill-amber-600">■ Lazer: 18%</text>
              <text x="0" y="98" className="fill-purple-600">■ Transporte: 10%</text>
            </g>
          </svg>
          <p className="text-xs text-emerald-700 font-semibold mt-1">Alimentação + Moradia = 30% + 22% = 52% (&gt; 50%)</p>
        </div>
      )}

      {type === "weather-fahrenheit" && (
        <div className="rounded-xl border border-sky-100 bg-sky-50/70 p-4 max-w-xs w-full text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="text-4xl">🌧️</span>
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-black text-slate-800">76°</span>
                <span className="text-xl font-bold text-sky-600">58°</span>
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase">Valores em Fahrenheit (°F)</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-2">
            Mínima: 58°F → °C = (58 - 32) ÷ 1,8 = 14,4 °C
          </p>
        </div>
      )}

      {/* Render equation card if provided */}
      {equation && (
        <div className="mt-2 rounded-lg bg-slate-100 px-4 py-2 border border-slate-200 text-sm font-mono text-slate-800 font-bold">
          {equation}
        </div>
      )}
    </div>
  );
};

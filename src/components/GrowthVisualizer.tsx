import React, { useState, useMemo } from 'react';
import { TrendingUp, Settings2, Activity } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

type FunctionType = 'O(1)' | 'O(log n)' | 'O(n)' | 'O(n log n)' | 'O(n^2)' | 'O(2^n)' | 'O(n!)' | 'O(n^n)';

interface DataPoint {
  n: number;
  'O(1)': number;
  'O(log n)': number;
  'O(n)': number;
  'O(n log n)': number;
  'O(n^2)': number;
  'O(2^n)': number;
  'O(n!)': number;
  'O(n^n)': number;
}

const COLORS: Record<FunctionType, string> = {
  'O(1)': '#2dd4bf', // teal-400
  'O(log n)': '#4ade80', // green-400
  'O(n)': '#facc15', // yellow-400
  'O(n log n)': '#fb923c', // orange-400
  'O(n^2)': '#f87171', // red-400
  'O(2^n)': '#c084fc', // purple-400
  'O(n!)': '#f472b6', // pink-400
  'O(n^n)': '#60a5fa', // blue-400
};

const FUNCTION_LABELS: Record<FunctionType, string> = {
  'O(1)': 'O(1) - Constante',
  'O(log n)': 'O(log n) - Logarítmica',
  'O(n)': 'O(n) - Lineal',
  'O(n log n)': 'O(n log n) - Linealítmica',
  'O(n^2)': 'O(n²) - Cuadrática',
  'O(2^n)': 'O(2ⁿ) - Exponencial',
  'O(n!)': 'O(n!) - Factorial',
  'O(n^n)': 'O(nⁿ) - Exponencial Sup.',
};

export default function GrowthVisualizer() {
  const [maxN, setMaxN] = useState<number>(50);
  const [scaleType, setScaleType] = useState<'linear' | 'log'>('linear');
  
  const [visibleFunctions, setVisibleFunctions] = useState<Record<FunctionType, boolean>>({
    'O(1)': true,
    'O(log n)': true,
    'O(n)': true,
    'O(n log n)': true,
    'O(n^2)': true,
    'O(2^n)': true,
    'O(n!)': true,
    'O(n^n)': true,
  });

  const toggleFunction = (func: FunctionType) => {
    setVisibleFunctions(prev => ({
      ...prev,
      [func]: !prev[func]
    }));
  };

  const chartData = useMemo(() => {
    const data: DataPoint[] = [];
    let fact = 1;
    // Start from n=1 to avoid log(0) and keep functions well-defined
    for (let n = 1; n <= maxN; n++) {
      fact *= n;
      data.push({
        n,
        'O(1)': 1,
        'O(log n)': Math.log2(n),
        'O(n)': n,
        'O(n log n)': n * Math.log2(n),
        'O(n^2)': Math.pow(n, 2),
        'O(2^n)': Math.pow(2, n),
        'O(n!)': fact,
        'O(n^n)': Math.pow(n, n),
      });
    }
    return data;
  }, [maxN]);

  // Format Y-axis ticks to handle large exponential values neatly
  const formatYAxis = (tickItem: any) => {
    if (tickItem >= 1e12) return tickItem.toExponential(1);
    if (tickItem >= 1e9) return (tickItem / 1e9).toFixed(1) + 'B';
    if (tickItem >= 1e6) return (tickItem / 1e6).toFixed(1) + 'M';
    if (tickItem >= 1e3) return (tickItem / 1e3).toFixed(1) + 'k';
    return tickItem;
  };

  // Safe logarithmic scaling domain
  const yAxisProps = scaleType === 'log' ? {
    scale: 'log',
    domain: [1, 'auto'],
    allowDataOverflow: true,
  } : {
    scale: 'linear',
    domain: [0, 'auto']
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] p-6 lg:p-8 selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-semibold text-white tracking-tight flex items-center gap-3">
            <TrendingUp className="text-indigo-500 w-8 h-8" />
            Tasas de Crecimiento Asintótico
          </h1>
          <p className="text-justify text-slate-400 mt-2 text-sm max-w-2xl">
            Visualización comparativa de las complejidades algorítmicas más comunes, demostrando cómo escala el tiempo de ejecución en relación al tamaño de la entrada.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
              <h2 className="text-lg font-medium text-white flex items-center gap-2 mb-4">
                <Settings2 className="w-5 h-5 text-indigo-400" /> Parámetros
              </h2>

              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-400 flex justify-between">
                  <span>Tamaño de Entrada (n):</span>
                  <span className="text-white font-bold">{maxN}</span>
                </label>
                <input 
                  type="range" min="1" max="100" step="1" 
                  value={maxN} 
                  onChange={e => setMaxN(parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-800">
                <label className="text-sm font-medium text-slate-400">
                  Escala Eje Y:
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setScaleType('linear')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border
                      ${scaleType === 'linear' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'}`}
                  >
                    Lineal
                  </button>
                  <button
                    onClick={() => setScaleType('log')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border
                      ${scaleType === 'log' ? 'bg-purple-600/20 border-purple-500 text-purple-300' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'}`}
                  >
                    Logarítmica
                  </button>
                </div>
                {scaleType === 'log' && (
                  <p className="text-justify text-xs text-slate-500 italic mt-2">
                    *La escala logarítmica es ideal para comparar funciones exponenciales y polinomiales en el mismo gráfico sin aplanar las curvas inferiores.
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* Chart Area */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col min-h-[600px] overflow-hidden relative">
              <div className="flex-1 min-h-[450px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                  margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="n" 
                    stroke="#64748b" 
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                    tickMargin={10}
                    label={{ value: 'Tamaño de entrada (n)', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 14 }}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                    tickFormatter={formatYAxis}
                    tickMargin={10}
                    label={{ value: 'Operaciones', angle: -90, position: 'insideLeft', offset: 0, fill: '#64748b', fontSize: 14 }}
                    {...(yAxisProps as any)}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.5rem', color: '#f8fafc' }}
                    itemStyle={{ fontSize: 13, fontWeight: 500 }}
                    labelStyle={{ color: '#94a3b8', marginBottom: 4 }}
                    formatter={(value: number) => {
                      if (value > 10000) return value.toExponential(2);
                      return Number.isInteger(value) ? value : value.toFixed(2);
                    }}
                    labelFormatter={(label) => `n = ${label}`}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                  {visibleFunctions['O(1)'] && <Line type="monotone" dataKey="O(1)" stroke={COLORS['O(1)']} strokeWidth={3} dot={false} isAnimationActive={false} />}
                  {visibleFunctions['O(log n)'] && <Line type="monotone" dataKey="O(log n)" stroke={COLORS['O(log n)']} strokeWidth={3} dot={false} isAnimationActive={false} />}
                  {visibleFunctions['O(n)'] && <Line type="monotone" dataKey="O(n)" stroke={COLORS['O(n)']} strokeWidth={3} dot={false} isAnimationActive={false} />}
                  {visibleFunctions['O(n log n)'] && <Line type="monotone" dataKey="O(n log n)" stroke={COLORS['O(n log n)']} strokeWidth={3} dot={false} isAnimationActive={false} />}
                  {visibleFunctions['O(n^2)'] && <Line type="monotone" dataKey="O(n^2)" stroke={COLORS['O(n^2)']} strokeWidth={3} dot={false} isAnimationActive={false} />}
                  {visibleFunctions['O(2^n)'] && <Line type="monotone" dataKey="O(2^n)" stroke={COLORS['O(2^n)']} strokeWidth={3} dot={false} isAnimationActive={false} />}
                  {visibleFunctions['O(n!)'] && <Line type="monotone" dataKey="O(n!)" stroke={COLORS['O(n!)']} strokeWidth={3} dot={false} isAnimationActive={false} />}
                  {visibleFunctions['O(n^n)'] && <Line type="monotone" dataKey="O(n^n)" stroke={COLORS['O(n^n)']} strokeWidth={3} dot={false} isAnimationActive={false} />}
                </LineChart>
              </ResponsiveContainer>
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-800">
                <div className="flex flex-wrap gap-3 justify-center">
                  {(Object.keys(FUNCTION_LABELS) as FunctionType[]).map(func => (
                    <button
                      key={func}
                      onClick={() => toggleFunction(func)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border flex items-center gap-2
                        ${visibleFunctions[func] 
                          ? 'bg-slate-800 border-slate-600 text-slate-200 shadow-md' 
                          : 'bg-slate-950 border-slate-800 text-slate-600'}`}
                    >
                      <div 
                        className="w-3 h-3 rounded-full shadow-inner" 
                        style={{ backgroundColor: visibleFunctions[func] ? COLORS[func] : '#334155' }}
                      />
                      {FUNCTION_LABELS[func]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

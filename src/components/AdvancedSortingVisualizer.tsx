import React, { useState, useEffect } from 'react';
import { Play, Pause, Shuffle, BarChart2, Info, FileCode2, TrendingUp, Clock } from 'lucide-react';
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

type AlgoType = 'heapsort' | 'mergesort' | 'comparison';

const CODE_SNIPPETS: Record<string, string[]> = {
  heapsort: [
    "template<class T> void",
    "heap_sort(typename vector<T>::iterator first,",
    "          typename vector<T>::iterator last,",
    "          bool (*comp)(T&,T&)) {",
    "    make_heap(first, last, comp);",
    "    typename vector<T>::iterator heap_last = last;",
    "    T tmp;",
    "    while (heap_last > first) {",
    "        heap_last--;",
    "        tmp = *first;",
    "        *first = *heap_last;",
    "        *heap_last = tmp;",
    "        re_heap(first, heap_last, comp);",
    "    }",
    "}"
  ],
  mergesort: [
    "template<class T> void",
    "merge_sort(typename vector<T>::iterator first,",
    "           typename vector<T>::iterator last,",
    "           bool (*comp)(T&,T&)) {",
    "    vector<T> tmp(last - first);",
    "    merge_sort(first, last, tmp, comp);",
    "}",
    "",
    "// Internamente divide el rango a la mitad (middle)",
    "// merge_sort(first, middle, tmp, comp);",
    "// merge_sort(middle, last, tmp, comp);",
    "// ... y luego intercala (merge) las mitades"
  ]
};

function getHeapSortHistory(arr: number[]) {
  const history: { array: number[]; activeIndices: number[]; sortedIndices: number[] }[] = [];
  const array = [...arr];

  function pushHistory(activeIndices: number[] = [], sortedIndices: number[] = []) {
    history.push({ array: [...array], activeIndices, sortedIndices });
  }

  function heapify(n: number, i: number) {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;

    if (l < n) {
      pushHistory([largest, l]);
      if (array[l] > array[largest]) largest = l;
    }
    
    if (r < n) {
      pushHistory([largest, r]);
      if (array[r] > array[largest]) largest = r;
    }

    if (largest !== i) {
      const temp = array[i];
      array[i] = array[largest];
      array[largest] = temp;
      pushHistory([i, largest]);
      heapify(n, largest);
    }
  }

  for (let i = Math.floor(array.length / 2) - 1; i >= 0; i--) {
    heapify(array.length, i);
  }

  const sorted: number[] = [];
  for (let i = array.length - 1; i > 0; i--) {
    const temp = array[0];
    array[0] = array[i];
    array[i] = temp;
    sorted.push(i);
    pushHistory([0, i], [...sorted]);
    heapify(i, 0);
  }
  sorted.push(0);
  pushHistory([], [...sorted]);
  
  return history;
}

function getMergeSortHistory(arr: number[]) {
  const history: { array: number[]; activeIndices: number[]; sortedIndices: number[] }[] = [];
  const array = [...arr];

  function pushHistory(activeIndices: number[] = [], sortedIndices: number[] = []) {
    history.push({ array: [...array], activeIndices, sortedIndices });
  }

  function merge(left: number, mid: number, right: number) {
    const n1 = mid - left + 1;
    const n2 = right - mid;
    
    const L = new Array(n1);
    const R = new Array(n2);
    
    for (let i = 0; i < n1; i++) L[i] = array[left + i];
    for (let j = 0; j < n2; j++) R[j] = array[mid + 1 + j];
    
    let i = 0, j = 0, k = left;
    
    while (i < n1 && j < n2) {
      pushHistory([left + i, mid + 1 + j]);
      if (L[i] <= R[j]) {
        array[k] = L[i];
        i++;
      } else {
        array[k] = R[j];
        j++;
      }
      pushHistory([k]);
      k++;
    }
    
    while (i < n1) {
      array[k] = L[i];
      pushHistory([k]);
      i++;
      k++;
    }
    
    while (j < n2) {
      array[k] = R[j];
      pushHistory([k]);
      j++;
      k++;
    }
  }

  function mergeSortHelper(left: number, right: number) {
    if (left >= right) return;
    const mid = left + Math.floor((right - left) / 2);
    mergeSortHelper(left, mid);
    mergeSortHelper(mid + 1, right);
    merge(left, mid, right);
  }

  mergeSortHelper(0, array.length - 1);
  pushHistory([], Array.from({length: array.length}, (_, i) => i));

  return history;
}

const COMPARISON_DATA = [
  { n: 1, 'merge-sort[vec,st]': 2e-7, 'heap-sort': 1.8e-7, 'STL[vec]': 1.5e-7, 'quick-sort[st]': 3e-7, 'merge-sort[list]': 8e-7, 'libc-sort': 4e-7 },
  { n: 10, 'merge-sort[vec,st]': 1.5e-7, 'heap-sort': 1.2e-7, 'STL[vec]': 1.1e-7, 'quick-sort[st]': 2.5e-7, 'merge-sort[list]': 7e-7, 'libc-sort': 3e-7 },
  { n: 100, 'merge-sort[vec,st]': 2.5e-7, 'heap-sort': 1.5e-7, 'STL[vec]': 1.2e-7, 'quick-sort[st]': 3.5e-7, 'merge-sort[list]': 1e-6, 'libc-sort': 5e-7 },
  { n: 1000, 'merge-sort[vec,st]': 3e-7, 'heap-sort': 2.5e-7, 'STL[vec]': 1.8e-7, 'quick-sort[st]': 4e-7, 'merge-sort[list]': 1.5e-6, 'libc-sort': 7e-7 },
  { n: 10000, 'merge-sort[vec,st]': 4e-7, 'heap-sort': 3.5e-7, 'STL[vec]': 2.5e-7, 'quick-sort[st]': 5e-7, 'merge-sort[list]': 2e-6, 'libc-sort': 1e-6 },
  { n: 100000, 'merge-sort[vec,st]': 5e-7, 'heap-sort': 4.5e-7, 'STL[vec]': 3.5e-7, 'quick-sort[st]': 6e-7, 'merge-sort[list]': 3e-6, 'libc-sort': 1.5e-6 },
  { n: 1000000, 'merge-sort[vec,st]': 6.5e-7, 'heap-sort': 6e-7, 'STL[vec]': 4.5e-7, 'quick-sort[st]': 8e-7, 'merge-sort[list]': 4e-6, 'libc-sort': 2e-6 },
  { n: 10000000, 'merge-sort[vec,st]': 8e-7, 'heap-sort': 7.5e-7, 'STL[vec]': 6e-7, 'quick-sort[st]': 1e-6, 'merge-sort[list]': 5.5e-6, 'libc-sort': 3e-6 },
  { n: 100000000, 'merge-sort[vec,st]': 1e-6, 'heap-sort': 9e-7, 'STL[vec]': 8e-7, 'quick-sort[st]': 1.5e-6, 'merge-sort[list]': 7e-6, 'libc-sort': 4.5e-6 },
  { n: 1000000000, 'merge-sort[vec,st]': 1.2e-6, 'heap-sort': 1e-6, 'STL[vec]': 9e-7, 'quick-sort[st]': 1.8e-6, 'merge-sort[list]': 9e-6, 'libc-sort': 6e-6 },
];

export default function AdvancedSortingVisualizer() {
  const [activeTab, setActiveTab] = useState<AlgoType>('heapsort');
  const [array, setArray] = useState<number[]>([]);
  const [history, setHistory] = useState<{ array: number[]; activeIndices: number[]; sortedIndices: number[] }[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(100);

  const generateArray = () => {
    const newArray = Array.from({ length: 20 }, () => Math.floor(Math.random() * 100) + 10);
    setArray(newArray);
    setCurrentStep(0);
    setIsPlaying(false);
    
    if (activeTab === 'heapsort') {
      setHistory(getHeapSortHistory(newArray));
    } else if (activeTab === 'mergesort') {
      setHistory(getMergeSortHistory(newArray));
    }
  };

  useEffect(() => {
    if (activeTab !== 'comparison') {
      generateArray();
    }
  }, [activeTab]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && currentStep < history.length - 1) {
      timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 200 - speed);
    } else if (currentStep >= history.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, history.length, speed]);

  const currentDisplay = history[currentStep] || { array, activeIndices: [], sortedIndices: [] };

  return (
    <div className="p-4 md:p-8 flex flex-col items-center w-full">
      <div className="max-w-6xl w-full mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start pb-6 border-b border-slate-800">
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-white tracking-tight flex items-center gap-3">
              <BarChart2 className="text-indigo-500 w-8 h-8" />
              Ordenamiento II: Algoritmos Avanzados
            </h1>
            <p className="text-justify text-slate-400 mt-2 text-sm max-w-3xl">
              Explora algoritmos de ordenamiento de mayor eficiencia matemática, como Heapsort y Mergesort, y analiza sus curvas de rendimiento asintótico empírico .
            </p>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab('heapsort')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'heapsort' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            Heap-sort
          </button>
          <button
            onClick={() => setActiveTab('mergesort')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'mergesort' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            Merge-sort
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'comparison' ? 'bg-amber-600/20 text-amber-400 border border-amber-500/50' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            <TrendingUp className="w-4 h-4" /> Comparación 
          </button>
        </div>

        {activeTab !== 'comparison' ? (
          <>
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl mb-6 text-sm text-slate-300">
              {activeTab === 'heapsort' ? (
                <div className="space-y-4">
                  <p className="text-justify">
                    <strong className="text-indigo-400">Heap-sort:</strong> Es un algoritmo de ordenamiento in-place con un tiempo de ejecución garantizado de <code className="text-emerald-400">O(n log n)</code> en el peor de los casos. Se basa en el TAD <em>Cola de Prioridad</em> implementado mediante un "Montículo" (Heap).
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong className="text-slate-200">Fase inicial (make_heap):</strong> Convierte el arreglo desordenado en un montículo maximal en tiempo <code className="text-emerald-400">O(n)</code>. En un montículo maximal, el padre siempre es mayor o igual que sus hijos.</li>
                    <li><strong className="text-slate-200">Fase final:</strong> Extrae repetidamente el elemento máximo (la raíz) y lo intercambia con el último elemento del montículo, reduciendo el tamaño del montículo en 1 y aplicando <code className="text-indigo-300">re_heap()</code> a la raíz para restaurar la propiedad en tiempo <code className="text-emerald-400">O(log n)</code>.</li>
                  </ul>
                  <p className="text-justify text-slate-400 italic">
                    Nota: Heap-sort <strong>no es estable</strong> ya que, al mover elementos desde el final a la raíz, no se garantiza conservar el orden relativo original de los elementos equivalentes.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-justify">
                    <strong className="text-indigo-400">Merge-sort:</strong> Algoritmo basado en "dividir para vencer", con tiempo de ejecución <code className="text-emerald-400">O(n log n)</code> en todos los casos.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Divide el rango a la mitad hasta llegar a subrangos de tamaño 1.</li>
                    <li>Combina (intercala o fusiona) recursivamente las mitades ya ordenadas manteniendo el orden general.</li>
                    <li><strong className="text-slate-200">Para Vectores:</strong> Es muy eficiente pero <strong>requiere memoria adicional</strong> <code className="text-amber-400">O(n)</code> para el arreglo auxiliar. Es estable.</li>
                    <li><strong className="text-slate-200">Para Listas:</strong> Es el algoritmo de elección por excelencia, pues es estable, no requiere arreglos auxiliares completos y su comportamiento secuencial se ajusta perfectamente a la limitación de carecer de acceso aleatorio.</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Visualizer Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={generateArray}
                      className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                    >
                      <Shuffle className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Velocidad
                    </span>
                    <input
                      type="range"
                      min="10"
                      max="190"
                      value={speed}
                      onChange={(e) => setSpeed(Number(e.target.value))}
                      className="w-24 accent-indigo-500"
                    />
                  </div>
                </div>

                {/* Bars */}
                <div className="flex-1 flex items-end justify-center gap-1 md:gap-2 h-64 mt-4">
                  {currentDisplay.array.map((val, idx) => {
                    const isActive = currentDisplay.activeIndices.includes(idx);
                    const isSorted = currentDisplay.sortedIndices.includes(idx);
                    
                    return (
                      <div
                        key={idx}
                        className={`w-4 md:w-8 rounded-t-sm transition-all duration-200 ${
                          isActive ? 'bg-amber-400' :
                          isSorted ? 'bg-emerald-500/90' :
                          'bg-indigo-500/80'
                        }`}
                        style={{
                          height: `${(val / 100) * 100}%`,
                          opacity: isActive ? 1 : 0.8
                        }}
                        title={`Valor: ${val}`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Code Panel */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden">
                <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                  <FileCode2 className="w-5 h-5 text-indigo-400" />
                  Implementación
                </h2>
                <div className="bg-slate-950 rounded-xl p-3 md:p-4 overflow-x-hidden text-[10px] sm:text-xs md:text-sm font-mono text-slate-300 border border-slate-800/50">
                  <div className="flex flex-col w-full">
                    {CODE_SNIPPETS[activeTab].map((line, idx) => (
                      <div key={idx} className="px-2 py-0.5 rounded transition-colors whitespace-pre-wrap break-all sm:break-normal border-transparent text-slate-400 hover:bg-slate-800/30">
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
            <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              Comparación de Algoritmos 
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={COMPARISON_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis 
                      dataKey="n" 
                      scale="log" 
                      domain={['auto', 'auto']} 
                      type="number"
                      tickFormatter={(val) => `1e${Math.log10(val)}`}
                      stroke="#64748b"
                    />
                    <YAxis 
                      scale="log" 
                      domain={['auto', 'auto']}
                      tickFormatter={(val) => `${val.toExponential(1)}`}
                      stroke="#64748b"
                      label={{ value: 'T(n)/n [sec]', angle: -90, position: 'insideLeft', fill: '#64748b' }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.5rem' }}
                      itemStyle={{ fontSize: '12px' }}
                      formatter={(value: number) => value.toExponential(2)}
                      labelFormatter={(label) => `n = ${label}`}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                    <Line type="monotone" dataKey="STL[vec]" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="heap-sort" stroke="#10b981" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="quick-sort[st]" stroke="#f59e0b" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="merge-sort[vec,st]" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="libc-sort" stroke="#8b5cf6" strokeWidth={2} dot={false} strokeDasharray="4 4" />
                    <Line type="monotone" dataKey="merge-sort[list]" stroke="#6366f1" strokeWidth={2} dot={false} strokeDasharray="6 6" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="lg:col-span-1 space-y-4 text-sm text-slate-300 text-justify">
                <p>
                  <strong>STL[vec]:</strong> Versión de <code>sort</code> del header <code>&lt;algorithm&gt;</code> de C++ estándar.
                </p>
                <p>
                  <strong>merge-sort[vec,st]:</strong> Versión estable de merge-sort para vectores (no in-place).
                </p>
                <p>
                  <strong>libc-sort:</strong> Rutina que viene con la librería estándar de C (<code>qsort</code>).
                </p>
                <p>
                  <strong>heap-sort:</strong> Algoritmo de ordenamiento por montículos (garantiza <code className="text-emerald-400">O(n log n)</code>).
                </p>
                <p>
                  <strong>quick-sort[st]:</strong> Ordenamiento rápido estable.
                </p>
                <p>
                  <strong>merge-sort[list]:</strong> Implementación de merge-sort para listas. Generalmente la manipulación de listas es más lenta que el acceso aleatorio a vectores, lo que se refleja en su curva superior.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

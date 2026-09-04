import React, { useState, useEffect } from 'react';
import { Play, Pause, Shuffle, BarChart2, Info, Timer, LayoutGrid, Clock, FileCode2 } from 'lucide-react';
import { algorithmsData, Action } from '../algorithms';

const CODE_SNIPPETS: Record<string, string[]> = {
  bubble: [
    "void bubbleSort(vector<int>& arr) {",
    "    int n = arr.size();",
    "    for (int i = 0; i < n - 1; i++) {",
    "        for (int j = 0; j < n - i - 1; j++) {",
    "            if (arr[j] > arr[j + 1]) {",
    "                swap(arr[j], arr[j + 1]);",
    "            }",
    "        }",
    "    }",
    "}"
  ],
  selection: [
    "void selectionSort(vector<int>& arr) {",
    "    int n = arr.size();",
    "    for (int i = 0; i < n - 1; i++) {",
    "        int min_idx = i;",
    "        for (int j = i + 1; j < n; j++) {",
    "            if (arr[j] < arr[min_idx]) {",
    "                min_idx = j;",
    "            }",
    "        }",
    "        swap(arr[i], arr[min_idx]);",
    "    }",
    "}"
  ],
  insertion: [
    "void insertionSort(vector<int>& arr) {",
    "    int n = arr.size();",
    "    for (int i = 1; i < n; i++) {",
    "        int key = arr[i];",
    "        int j = i - 1;",
    "        while (j >= 0 && arr[j] > key) {",
    "            arr[j + 1] = arr[j];",
    "            j--;",
    "        }",
    "        arr[j + 1] = key;",
    "    }",
    "}"
  ],
  quick: [
    "int partition(vector<int>& arr, int low, int high) {",
    "    int pivot = arr[high];",
    "    int i = (low - 1);",
    "    for (int j = low; j <= high - 1; j++) {",
    "        if (arr[j] < pivot) {",
    "            i++;",
    "            swap(arr[i], arr[j]);",
    "        }",
    "    }",
    "    swap(arr[i + 1], arr[high]);",
    "    return (i + 1);",
    "}",
    "",
    "void quickSort(vector<int>& arr, int low, int high) {",
    "    if (low < high) {",
    "        int pi = partition(arr, low, high);",
    "        quickSort(arr, low, pi - 1);",
    "        quickSort(arr, pi + 1, high);",
    "    }",
    "}"
  ]
};

export default function SortingVisualizer() {
  const [size, setSize] = useState(40);
  const [speed, setSpeed] = useState(50);
  const [algorithm, setAlgorithm] = useState('bubble');

  const [baseArray, setBaseArray] = useState<number[]>([]);
  const [currentArray, setCurrentArray] = useState<number[]>([]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [actions, setActions] = useState<Action[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [activeCodeLines, setActiveCodeLines] = useState<number[]>([]);

  // Minimum delay 10ms, max delay ~500ms
  const delay = Math.max(10, 500 - speed * 4.9);

  const generateArray = (newSize: number = size) => {
    const newArr = Array.from({ length: newSize }, () => Math.floor(Math.random() * 90) + 10);
    setBaseArray(newArr);
    setCurrentArray(newArr);
    setActions([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setActiveIndices([]);
    setSortedIndices([]);
    setActiveCodeLines([]);
  };

  useEffect(() => {
    generateArray();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isPlaying && currentStep < actions.length) {
      timer = setTimeout(() => {
        const action = actions[currentStep];
        setCurrentArray(prev => {
          const next = [...prev];
          if (action.type === 'swap') {
            const temp = next[action.indices[0]];
            next[action.indices[0]] = next[action.indices[1]];
            next[action.indices[1]] = temp;
          } else if (action.type === 'overwrite') {
            next[action.index] = action.value;
          }
          return next;
        });

        if (action.type === 'compare' || action.type === 'swap') {
          setActiveIndices(action.indices);
        } else if (action.type === 'overwrite') {
          setActiveIndices([action.index]);
        } else if (action.type === 'mark_sorted') {
          setSortedIndices(prev => Array.from(new Set([...prev, action.index])));
          setActiveIndices([]);
        }

        if (action.lines) {
          setActiveCodeLines(action.lines);
        } else {
          setActiveCodeLines([]);
        }

        setCurrentStep(s => s + 1);
      }, delay);
    } else if (isPlaying && currentStep >= actions.length) {
      setIsPlaying(false);
      setActiveIndices([]);
      setActiveCodeLines([]);
      setSortedIndices(Array.from({ length: currentArray.length }, (_, i) => i));
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, actions, delay, currentArray.length]);

  const handlePlayPause = () => {
    if (!isPlaying) {
      let currentActions = actions;
      if (currentActions.length === 0) {
        currentActions = algorithmsData[algorithm].run([...baseArray]);
        setActions(currentActions);
      }
      if (currentStep >= currentActions.length) {
        setCurrentArray([...baseArray]);
        setCurrentStep(0);
        setSortedIndices([]);
        setActiveCodeLines([]);
        setActiveIndices([]);
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value);
    setSize(newSize);
    generateArray(newSize);
  };

  const handleAlgoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAlgorithm(e.target.value);
    setCurrentArray([...baseArray]);
    setActions([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setActiveIndices([]);
    setSortedIndices([]);
  };

  const currentAlgoData = algorithmsData[algorithm];
  const progress = actions.length > 0 ? (currentStep / actions.length) * 100 : 0;

  return (
    <div className="p-4 md:p-8 flex flex-col items-center w-full">
      <div className="max-w-6xl w-full mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start pb-6 border-b border-slate-800">
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-white tracking-tight flex items-center gap-3">
              <BarChart2 className="text-indigo-500 w-8 h-8" />
              Algoritmos de Ordenamiento
            </h1>
            <p className="text-justify text-slate-400 mt-2 text-sm max-w-3xl">
              Entiende la lógica y los costos computacionales mediante gráficos interactivos en tiempo real. 
            </p>
            <div className="mt-4 flex flex-col gap-2 text-sm text-slate-400 max-w-3xl">
              <p className="text-justify">
                <strong className="text-indigo-400">{currentAlgoData.name}:</strong> {currentAlgoData.description}
              </p>
              <div className="flex flex-wrap gap-4 items-center">
                <span className="flex gap-2">
                  <strong className="text-slate-300">Tiempo (Mejor/Prom/Peor):</strong>
                  <span className="font-mono text-emerald-400">{currentAlgoData.timeComplexity.best}</span> /
                  <span className="font-mono text-amber-400">{currentAlgoData.timeComplexity.average}</span> /
                  <span className="font-mono text-rose-400">{currentAlgoData.timeComplexity.worst}</span>
                </span>
                <span className="text-slate-600">|</span>
                <span className="flex gap-2">
                  <strong className="text-slate-300">Espacio:</strong>
                  <span className="font-mono text-purple-400">{currentAlgoData.spaceComplexity}</span>
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Controls Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl">
              <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-indigo-400" />
                Controles
              </h2>
              
              <div className="space-y-5">
                {/* Algorithm Select */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Algoritmo</label>
                  <select
                    value={algorithm}
                    onChange={handleAlgoChange}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                  >
                    {Object.entries(algorithmsData).map(([key, data]) => (
                      <option key={key} value={key}>{data.name}</option>
                    ))}
                  </select>
                </div>

                {/* Array Size */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-400">Tamaño del Arreglo</label>
                    <span className="text-xs text-indigo-400 font-mono bg-indigo-500/10 px-2 py-0.5 rounded-full">{size}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={size}
                    onChange={handleSizeChange}
                    disabled={isPlaying}
                    className="w-full accent-indigo-500 disabled:opacity-50"
                  />
                </div>

                {/* Speed */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-400">Velocidad</label>
                    <span className="text-xs text-indigo-400 font-mono bg-indigo-500/10 px-2 py-0.5 rounded-full">{speed}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={speed}
                    onChange={(e) => setSpeed(parseInt(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>
                
                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handlePlayPause}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-colors ${
                      isPlaying 
                        ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 border border-amber-500/30' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-900/50'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    {isPlaying ? 'Pausar' : 'Iniciar'}
                  </button>
                  <button
                    onClick={() => generateArray(size)}
                    disabled={isPlaying}
                    className="px-4 py-2.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Generar Nuevo Arreglo"
                  >
                    <Shuffle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Visualizer Area */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 md:p-6 shadow-xl flex-1 flex flex-col min-h-[300px] md:min-h-[500px]">
              
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full mb-6 overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Bars Chart */}
              <div className="flex-1 w-full flex items-end justify-center gap-[2px] sm:gap-1">
                {currentArray.map((val, idx) => {
                  let bgColor = 'bg-indigo-400/80'; // default
                  if (activeIndices.includes(idx)) {
                    bgColor = 'bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.4)]'; // active comparing/swapping
                  } else if (sortedIndices.includes(idx)) {
                    bgColor = 'bg-emerald-500/90'; // sorted
                  }

                  return (
                    <div
                      key={idx}
                      className={`w-full rounded-t-sm transition-all duration-75 ${bgColor}`}
                      style={{ 
                        height: `${val}%`,
                        minWidth: '2px'
                      }}
                      title={`Valor: ${val}`}
                    />
                  );
                })}
              </div>
              
              <div className="flex justify-between items-center mt-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-400/80"></div>
                  <span>Sin Ordenar</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <span>Comparando / Intercambiando</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500/90"></div>
                  <span>Ordenado</span>
                </div>
              </div>

            </div>

            {/* Code Visualization Panel */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden">
              <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-indigo-400" />
                Implementación en C++
              </h2>
              <div className="bg-slate-950 rounded-xl p-3 md:p-4 overflow-x-hidden text-[10px] sm:text-xs md:text-sm font-mono text-slate-300 border border-slate-800/50">
                <div className="flex flex-col w-full">
                  {CODE_SNIPPETS[algorithm].map((line, idx) => {
                    const isActive = activeCodeLines.includes(idx);
                    return (
                      <div key={idx} className={`px-2 py-0.5 rounded transition-colors whitespace-pre-wrap break-all sm:break-normal border-l-2 ${isActive ? 'bg-indigo-900/50 border-indigo-400 text-indigo-200 font-semibold shadow-inner' : 'border-transparent text-slate-400 hover:bg-slate-800/30'}`}>
                        {line}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Teoría de Ordenamiento Directo e Indirecto */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl mt-6">
          <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-indigo-400" />
            Ordenamiento Directo vs. Indirecto
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-sm text-slate-300 leading-relaxed">
            <div className="space-y-4 text-justify">
              <p>
                <strong>Ordenamiento Directo:</strong> Los algoritmos mostrados arriba actúan directamente sobre los elementos, intercambiando (copiando y sobrescribiendo) sus valores en la memoria. Si los elementos a ordenar son complejos o de gran tamaño (por ejemplo, objetos grandes, cadenas de caracteres extensas), el costo de la operación de intercambio puede volverse un cuello de botella significativo, superando incluso al costo de las comparaciones.
              </p>
              <p>
                <strong>Ordenamiento Indirecto:</strong> Si el intercambio de elementos es muy costoso, podemos reducir notablemente la penalización de rendimiento ordenando un vector auxiliar de cursores o punteros (índices) en lugar de mover los objetos reales. 
              </p>
            </div>
            <div className="space-y-4 text-justify bg-slate-950 p-5 rounded-xl border border-slate-800/50">
              <h3 className="text-emerald-400 font-medium text-base mb-2">Funcionamiento del Ordenamiento Indirecto</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Se utiliza un arreglo auxiliar <code className="text-indigo-300">indx</code> del mismo tamaño, inicializado de forma que <code className="text-indigo-300">indx[i] = i</code>.</li>
                <li>Las comparaciones se realizan accediendo a los elementos reales a través del índice: se compara <code className="text-indigo-300">A[indx[i]]</code> con <code className="text-indigo-300">A[indx[j]]</code>.</li>
                <li>Cuando se requiere un intercambio, <strong>sólo se intercambian los enteros en el vector <code className="text-indigo-300">indx</code></strong>, no los elementos de <code className="text-indigo-300">A</code>.</li>
                <li>Al finalizar, <code className="text-indigo-300">indx</code> contiene la permutación que ordena lógicamente a <code className="text-indigo-300">A</code>. Posteriormente, se puede aplicar un algoritmo de reordenamiento in-place en <code className="text-emerald-400">O(N)</code> para reubicar los elementos reales si es necesario.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

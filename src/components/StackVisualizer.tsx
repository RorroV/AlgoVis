import React, { useState } from 'react';
import { Layers, Plus, Minus, Info, Calculator, Database } from 'lucide-react';

const STACK_CODE = [
  "// Implementación de Pila usando list<T>",
  "class stack : private list<T> {",
  "  int size_m;",
  "public:",
  "  stack() : size_m(0) { }",
  "  T &top() { return *begin(); }",
  "  void pop() { ",
  "    erase(begin());",
  "    size_m--;",
  "  }",
  "  void push(T x) {",
  "    insert(begin(), x);",
  "    size_m++;",
  "  }",
  "};"
];

const QUEUE_CODE = [
  "// Implementación de Cola usando list<T>",
  "class queue : private list<T> {",
  "  int size_m;",
  "public:",
  "  queue() : size_m(0) { }",
  "  T &front() { return *begin(); }",
  "  void pop() {",
  "    erase(begin());",
  "    size_m--;",
  "  }",
  "  void push(T x) {",
  "    insert(end(), x);",
  "    size_m++;",
  "  }",
  "};"
];

const RPN_CODE = [
  "// Notación Polaca Inversa (RPN) con pila",
  "// calc> 2 3 + 5 *",
  "stack<double> P;",
  "",
  "// Si ingresa un operando (ej: 2, 3):",
  "P.push(val);",
  "",
  "// Si ingresa un operador (ej: +):",
  "double v2 = P.top(); P.pop();",
  "double v1 = P.top(); P.pop();",
  "P.push(v1 + v2);"
];

export default function StackQueueVisualizer() {
  const [activeTab, setActiveTab] = useState<'stack' | 'queue'>('stack');
  const [items, setItems] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState('');
  
  const [activeCode, setActiveCode] = useState<'stack' | 'queue' | 'rpn'>('stack');
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handlePush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue || isNaN(Number(inputValue)) || isPlaying) return;
    const val = Number(inputValue);
    setInputValue('');
    setIsPlaying(true);
    
    setActiveCode(activeTab);
    setActiveLine( activeTab === 'stack' ? 10 : 10 ); // void push()
    await new Promise(r => setTimeout(r, 400));
    setActiveLine( activeTab === 'stack' ? 11 : 11 ); // insert()
    
    setItems(prev => [...prev, val]);
    
    await new Promise(r => setTimeout(r, 400));
    setActiveLine( activeTab === 'stack' ? 12 : 12 ); // size_m++
    await new Promise(r => setTimeout(r, 400));
    setActiveLine(null);
    setIsPlaying(false);
  };

  const handlePop = async () => {
    if (items.length === 0 || isPlaying) return;
    setIsPlaying(true);
    
    setActiveCode(activeTab);
    setActiveLine( activeTab === 'stack' ? 6 : 6 ); // void pop()
    await new Promise(r => setTimeout(r, 400));
    setActiveLine( activeTab === 'stack' ? 7 : 7 ); // erase()
    
    setItems(prev => activeTab === 'stack' ? prev.slice(0, -1) : prev.slice(1));
    
    await new Promise(r => setTimeout(r, 400));
    setActiveLine( activeTab === 'stack' ? 8 : 8 ); // size_m--
    await new Promise(r => setTimeout(r, 400));
    setActiveLine(null);
    setIsPlaying(false);
  };

  const CodeBlock = ({ code }: { code: string[] }) => (
    <div className="bg-[#0d1117] rounded-xl p-3 md:p-4 overflow-x-hidden border border-slate-800 font-mono text-[10px] sm:text-xs md:text-sm leading-relaxed md:leading-loose shadow-inner w-full h-full">
      {code.map((line, idx) => (
        <div key={idx} className={`flex transition-colors duration-150 ${activeLine === idx ? 'bg-indigo-900/50 border-l-2 border-indigo-400' : 'border-l-2 border-transparent'}`}>
          <span className="w-6 md:w-8 text-slate-600 select-none text-right pr-2 md:pr-4 shrink-0">{idx}</span>
          <span className={`${activeLine === idx ? 'text-indigo-200 font-semibold' : 'text-slate-400'} whitespace-pre-wrap break-all sm:break-normal`}>
            {line}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-4 md:p-8 flex flex-col items-center w-full">
      <div className="max-w-7xl w-full mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start pb-6 border-b border-slate-800">
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-white tracking-tight flex items-center gap-3">
              <Layers className="text-indigo-500 w-8 h-8" />
              Pilas y Colas
            </h1>
            <p className="text-justify text-slate-400 mt-2 text-sm max-w-3xl">
              TADs adaptadores basados en listas (LIFO y FIFO). 
            </p>
            <div className="mt-4 flex flex-col gap-2 text-sm text-slate-400 max-w-3xl">
              <p className="text-justify">
                <strong className="text-indigo-400">Adaptadores:</strong> Las <a href="https://cplusplus.com/reference/stack/stack/" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">Pilas (stack)</a> y <a href="https://cplusplus.com/reference/queue/queue/" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">Colas (queue)</a> se implementan como "adaptadores de contenedores". Internamente delegan la gestión de memoria a una <a href="https://cplusplus.com/reference/list/list/" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline"><code>list&lt;T&gt;</code></a> privada, exponiendo sólo una interfaz restrictiva (<a href="https://cplusplus.com/reference/stack/stack/push/" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">push</a>, <a href="https://cplusplus.com/reference/stack/stack/pop/" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">pop</a>, <a href="https://cplusplus.com/reference/stack/stack/top/" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">top</a> / <a href="https://cplusplus.com/reference/queue/queue/front/" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">front</a>).
              </p>
              <p className="text-justify">
                <strong className="text-emerald-400">Caso de uso (RPN):</strong> La pila es fundamental en las calculadoras de Notación Polaca Inversa. Los operandos se apilan, y al ingresar un operador, se extraen los dos últimos, se operan, y el resultado vuelve a la cima.
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0 bg-slate-900 p-1 rounded-lg border border-slate-800 shrink-0">
            <button
              onClick={() => { setActiveTab('stack'); setItems([]); setActiveCode('stack'); }}
              disabled={isPlaying}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'stack' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white disabled:opacity-50'}`}
            >
              Pila (LIFO)
            </button>
            <button
              onClick={() => { setActiveTab('queue'); setItems([]); setActiveCode('queue'); }}
              disabled={isPlaying}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'queue' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white disabled:opacity-50'}`}
            >
              Cola (FIFO)
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Controls & Theory */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* Actions */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
              <h2 className="text-lg font-medium text-white mb-4">Operaciones</h2>
              <form onSubmit={handlePush} className="space-y-2">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isPlaying}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:border-indigo-500 transition-colors mb-2"
                  placeholder="Valor Numérico"
                />
                <button
                  type="submit"
                  disabled={!inputValue || isPlaying}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" /> Push (Insertar)
                </button>
              </form>
              <button
                onClick={handlePop}
                disabled={items.length === 0 || isPlaying}
                className="w-full flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                <Minus className="w-4 h-4" /> Pop (Extraer)
              </button>
            </div>

            {/* Complexity Panel */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
              <h2 className="text-lg font-medium text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-indigo-400" />
                Eficiencia
              </h2>
              <div className="space-y-2 text-sm text-slate-400">
                <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span>Insertar (Push)</span>
                  <span className="font-mono text-emerald-400">O(1)</span>
                </div>
                <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span>Extraer (Pop)</span>
                  <span className="font-mono text-emerald-400">O(1)</span>
                </div>
                <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span>Top/Frent</span>
                  <span className="font-mono text-emerald-400">O(1)</span>
                </div>
                <div className="mt-4 text-xs text-slate-500 leading-relaxed text-center">
                  Al delegar a <code>list&lt;T&gt;</code>, las operaciones en los extremos (principio o fin) toman <strong>tiempo constante</strong> sin reubicación de memoria.
                </div>
              </div>
            </div>

          </div>

          {/* Visualization & Code Area */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl flex-1 flex flex-col min-h-[300px] overflow-hidden relative">
              <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center text-slate-400 text-sm">
                <span>{activeTab === 'stack' ? 'Tope (Último en entrar, primero en salir)' : 'Frente (Primero en entrar, primero en salir)'}</span>
                <span>Base / Final</span>
              </div>
              <div className={`flex-1 p-8 flex gap-2 overflow-x-auto ${activeTab === 'stack' ? 'flex-col-reverse justify-start items-center' : 'flex-row items-center justify-start'}`}>
                {items.length === 0 ? (
                  <div className="text-slate-500 font-medium m-auto">Vacío</div>
                ) : (
                  items.map((val, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-center font-mono text-2xl font-bold rounded-lg border-2 transition-all duration-300
                        ${(activeTab === 'stack' && idx === items.length - 1) || (activeTab === 'queue' && idx === 0)
                          ? 'border-emerald-400 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.2)]'
                          : 'border-indigo-500/50 bg-slate-800 text-white'
                        }
                        ${activeTab === 'stack' ? 'w-48 h-16' : 'w-20 h-20 shrink-0'}
                      `}
                    >
                      {val}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Pseudocode Row */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
              <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex gap-2 overflow-x-auto">
                <button onClick={() => setActiveCode('stack')} className={`shrink-0 px-3 py-1 rounded text-sm font-medium ${activeCode === 'stack' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>Clase stack</button>
                <button onClick={() => setActiveCode('queue')} className={`shrink-0 px-3 py-1 rounded text-sm font-medium ${activeCode === 'queue' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>Clase queue</button>
                <button onClick={() => setActiveCode('rpn')} className={`shrink-0 px-3 py-1 rounded text-sm font-medium ${activeCode === 'rpn' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>Uso (RPN)</button>
              </div>
              <div className="overflow-x-auto">
                <CodeBlock code={
                  activeCode === 'stack' ? STACK_CODE :
                  activeCode === 'queue' ? QUEUE_CODE :
                  RPN_CODE
                } />
              </div>
            </div>

          </div>
          
        </div>
      </div>
    </div>
  );
}

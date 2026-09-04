import React, { useState } from 'react';
import { Plus, Minus, Info, Link as LinkIcon, Trash2, ArrowRightLeft, Search } from 'lucide-react';

const INSERT_SLL = [
  "iterator_t list::insert(iterator_t p, elem_t k) {",
  "  iterator_t q = p->next;",
  "  iterator_t c = new cell;",
  "  p->next = c;",
  "  c->next = q;",
  "  c->elem = k;",
  "  if (q==NULL) last = c;",
  "  return p;",
  "}"
];

const INSERT_DLL = [
  "iterator_t list::insert(iterator_t p, elem_t k) {",
  "  iterator_t q = p->next;",
  "  iterator_t c = new cell;",
  "  p->next = c;",
  "  c->next = q;",
  "  c->prev = p;",
  "  if (q!=NULL) q->prev = c;",
  "  c->elem = k;",
  "  if (q==NULL) last = c;",
  "  return p;",
  "}"
];

const ERASE_SLL = [
  "iterator_t list::erase(iterator_t p) {",
  "  if (p->next == last) last = p;",
  "  iterator_t q = p->next;",
  "  p->next = q->next;",
  "  delete q;",
  "  return p;",
  "}"
];

const ERASE_DLL = [
  "iterator_t list::erase(iterator_t p) {",
  "  if (p->next == last) last = p;",
  "  iterator_t q = p->next;",
  "  p->next = q->next;",
  "  if (q->next!=NULL) q->next->prev = p;",
  "  delete q;",
  "  return p;",
  "}"
];

const CLEAR_CODE = [
  "void list::clear() {",
  "  erase(begin(), end());",
  "}"
];

const FIND_CODE = [
  "// Recorrido lineal (O(n))",
  "iterator_t p = begin();",
  "while (p != end()) {",
  "  if (retrieve(p) == k) {",
  "    return p;",
  "  }",
  "  p = next(p);",
  "}",
  "return end();"
];

interface Node {
  id: string;
  value: number;
}

export default function LinkedListVisualizer() {
  const [list, setList] = useState<Node[]>([
    { id: '1', value: 10 },
    { id: '2', value: 20 },
    { id: '3', value: 30 },
  ]);
  const [inputValue, setInputValue] = useState('');
  
  const [isDoublyLinked, setIsDoublyLinked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeCode, setActiveCode] = useState<'insert' | 'erase' | 'clear' | 'find'>('insert');
  const [activeLine, setActiveLine] = useState<number | null>(null);
  
  const [activeNodeIdx, setActiveNodeIdx] = useState<number | null>(null);
  const [targetNodeIdx, setTargetNodeIdx] = useState<number | null>(null);
  const delay = 600;

  const yieldStep = async (line: number | null) => {
    setActiveLine(line);
    await new Promise(r => setTimeout(r, delay));
  };

  const handlePrepend = async () => {
    if (!inputValue || isNaN(Number(inputValue)) || isPlaying) return;
    const val = Number(inputValue);
    setInputValue('');
    setIsPlaying(true);
    setActiveCode('insert');
    
    const newNode = { id: Math.random().toString(36).substr(2, 9), value: val };
    
    await yieldStep(0); 
    await yieldStep(1); 
    await yieldStep(2); 
    await yieldStep(3); 
    await yieldStep(4); 
    if (isDoublyLinked) {
      await yieldStep(5);
      await yieldStep(6);
      await yieldStep(7);
    } else {
      await yieldStep(5);
    }
    
    setList(prev => [newNode, ...prev]);
    setActiveNodeIdx(0);
    
    await yieldStep(isDoublyLinked ? 8 : 6); 
    await yieldStep(isDoublyLinked ? 9 : 7); 
    
    setActiveLine(null);
    setActiveNodeIdx(null);
    setIsPlaying(false);
  };

  const handleDelete = async () => {
    if (!inputValue || isNaN(Number(inputValue)) || isPlaying || list.length === 0) return;
    const val = Number(inputValue);
    setInputValue('');
    setIsPlaying(true);
    
    let foundIdx = -1;
    for (let i = 0; i < list.length; i++) {
      setActiveNodeIdx(i);
      await new Promise(r => setTimeout(r, 400));
      if (list[i].value === val) {
        foundIdx = i;
        break;
      }
    }
    
    if (foundIdx === -1) {
      setActiveNodeIdx(null);
      setIsPlaying(false);
      return;
    }
    
    // Now ERASE
    setActiveCode('erase');
    setTargetNodeIdx(foundIdx);
    
    await yieldStep(0); 
    await yieldStep(1); 
    await yieldStep(2); 
    await yieldStep(3); 
    
    if (isDoublyLinked) {
      await yieldStep(4); 
      await yieldStep(5); 
    } else {
      await yieldStep(4); 
    }
    
    setList(prev => prev.filter((_, idx) => idx !== foundIdx));
    setActiveNodeIdx(null);
    setTargetNodeIdx(null);
    
    await yieldStep(isDoublyLinked ? 6 : 5); 
    
    setActiveLine(null);
    setIsPlaying(false);
  };

  const handleClear = async () => {
    if (isPlaying || list.length === 0) return;
    setIsPlaying(true);
    setActiveCode('clear');
    
    await yieldStep(0);
    await yieldStep(1);
    
    setList([]);
    
    await yieldStep(2);
    setActiveLine(null);
    setIsPlaying(false);
  };

  const handleFind = async () => {
    if (!inputValue || isNaN(Number(inputValue)) || isPlaying || list.length === 0) return;
    const val = Number(inputValue);
    setInputValue('');
    setIsPlaying(true);
    setActiveCode('find');

    await yieldStep(0);
    await yieldStep(1); // p = begin()
    
    let foundIdx = -1;
    for (let i = 0; i < list.length; i++) {
      setActiveNodeIdx(i);
      await yieldStep(2); // while
      await yieldStep(3); // if (retrieve(p) == k)
      if (list[i].value === val) {
        foundIdx = i;
        await yieldStep(4); // return p
        break;
      }
      await yieldStep(6); // p = next(p)
    }
    
    if (foundIdx === -1) {
      setActiveNodeIdx(null);
      await yieldStep(8); // return end()
    }

    setActiveNodeIdx(null);
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
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center pb-6 border-b border-slate-800 gap-6">
          <div>
            <h1 className="text-3xl font-semibold text-white tracking-tight flex items-center gap-3">
              <LinkIcon className="text-indigo-500 w-8 h-8" />
              Listas Enlazadas
            </h1>
            <div className="text-slate-400 mt-4 text-sm max-w-3xl space-y-2 leading-relaxed">
              <p className="text-justify">
                Implementación mediante celdas enlazadas por punteros. Análisis de algoritmos y gestión dinámica de memoria.
              </p>
              <p className="text-justify text-indigo-200">
                Las <a href="https://cplusplus.com/reference/list/list/" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline"><strong>listas enlazadas (std::list)</strong></a> utilizan nodos asignados dinámicamente en el <em>heap</em>, almacenando un dato y un puntero (<code className="text-indigo-400">next</code>) a la celda sucesora. En las <strong>listas doblemente enlazadas</strong>, existe un puntero extra (<code className="text-indigo-400">prev</code>) para recorrer la lista hacia atrás, convirtiendo <a href="https://cplusplus.com/reference/iterator/prev/" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline"><code className="text-indigo-400 hover:text-indigo-300 transition-colors">prev(p)</code></a> en O(1) en lugar de O(n).
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDoublyLinked(!isDoublyLinked)}
            disabled={isPlaying}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors border ${isDoublyLinked ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/50' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'}`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            {isDoublyLinked ? 'Doblemente Enlazada' : 'Simplemente Enlazada'}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Controls */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
              <h2 className="text-lg font-medium text-white mb-4">Operaciones</h2>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isPlaying}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:border-indigo-500 transition-colors mb-2"
                placeholder="Valor (ej: 42)"
              />
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={handlePrepend}
                  disabled={isPlaying || !inputValue}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" /> Insertar Nodo
                </button>
                <button
                  onClick={handleFind}
                  disabled={isPlaying || !inputValue || list.length === 0}
                  className="w-full flex items-center justify-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <Search className="w-4 h-4" /> Buscar Valor
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isPlaying || !inputValue || list.length === 0}
                  className="w-full flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <Minus className="w-4 h-4" /> Borrar Valor
                </button>
                <button
                  onClick={handleClear}
                  disabled={isPlaying || list.length === 0}
                  className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 mt-2"
                >
                  <Trash2 className="w-4 h-4" /> Vaciar Lista (clear)
                </button>
              </div>
            </div>
            
            {/* Complexity Table */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl flex-1">
              <h2 className="text-sm font-medium text-white mb-4">
                Tiempos de ejecución
              </h2>
              <div className="space-y-3 text-sm text-slate-400">
                <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span>insert / erase</span>
                  <span className="font-mono text-emerald-400 font-bold">O(1)</span>
                </div>
                <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span>find / clear</span>
                  <span className="font-mono text-amber-400 font-bold">O(n)</span>
                </div>
                <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span>prev(p)</span>
                  <span className={`font-mono font-bold ${isDoublyLinked ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {isDoublyLinked ? 'O(1)' : 'O(n)'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization Area */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl flex-1 flex items-center justify-center min-h-[300px] overflow-x-auto p-8 relative">
              {list.length === 0 ? (
                <div className="text-slate-500 font-medium">Lista Vacía</div>
              ) : (
                <div className="flex items-center gap-1 w-max">
                  <div className="text-indigo-400 font-medium mr-4 flex flex-col items-center">
                    <span className="mb-2">first</span>
                    <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                  </div>
                  
                  {list.map((node, idx) => {
                    const isActive = activeNodeIdx === idx;
                    const isTarget = targetNodeIdx === idx;
                    const isLast = idx === list.length - 1;
                    
                    return (
                      <React.Fragment key={node.id}>
                        {/* The Node Box */}
                        <div className={`flex items-stretch h-20 rounded-lg border-2 transition-all duration-300 ${
                          isTarget ? 'border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)] scale-110 z-10 bg-slate-800' :
                          isActive ? 'border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)] scale-110 z-10 bg-slate-800' : 
                          'border-indigo-500/50 bg-slate-800'
                        }`}>
                          {isDoublyLinked && (
                            <div className="w-8 flex flex-col items-center justify-center border-r-2 border-slate-700 relative">
                              <span className="text-[8px] text-slate-500 mb-1">prev</span>
                              <div className={`w-1.5 h-1.5 rounded-full bg-indigo-400`}></div>
                            </div>
                          )}
                          {/* Value Area (elem) */}
                          <div className={`w-20 flex flex-col items-center justify-center border-r-2 ${
                            isTarget ? 'border-rose-500/50' : isActive ? 'border-amber-400/50' : 'border-slate-700'
                          }`}>
                            <span className="text-[10px] text-slate-500 mb-1">elem</span>
                            <span className={`font-mono text-xl font-bold ${
                              isTarget ? 'text-rose-400' : isActive ? 'text-amber-400' : 'text-white'
                            }`}>
                              {node.value}
                            </span>
                          </div>
                          {/* Pointer Area (next) */}
                          <div className="w-10 flex flex-col items-center justify-center relative">
                            <span className="text-[10px] text-slate-500 mb-1">next</span>
                            <div className={`w-1.5 h-1.5 rounded-full ${isTarget ? 'bg-rose-500' : isActive ? 'bg-amber-400' : 'bg-indigo-400'}`}></div>
                          </div>
                        </div>
                        
                        {/* The Arrow */}
                        <div className="w-12 flex flex-col justify-center px-1 gap-1">
                          <div className={`h-1 w-full relative ${isTarget ? 'bg-rose-500' : isActive && !isLast ? 'bg-amber-400' : 'bg-slate-700'}`}>
                            <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border-t-2 border-r-2 ${
                              isTarget ? 'border-rose-500' : isActive && !isLast ? 'border-amber-400' : 'border-slate-700'
                            }`}></div>
                          </div>
                          {isDoublyLinked && (
                            <div className={`h-1 w-full relative bg-slate-700`}>
                              <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border-b-2 border-l-2 border-slate-700`}></div>
                            </div>
                          )}
                        </div>
                      </React.Fragment>
                    );
                  })}
                  
                  <div className="text-slate-500 font-mono font-medium ml-2 flex flex-col items-center">
                    <span className="mb-2">NULL</span>
                    <div className="w-3 h-3 rounded-full bg-slate-800 border-2 border-slate-600"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Pseudocode Row */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
              <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex gap-2 overflow-x-auto">
                <button onClick={() => setActiveCode('insert')} className={`px-3 py-1 rounded text-sm font-medium whitespace-nowrap ${activeCode === 'insert' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>list::insert</button>
                <button onClick={() => setActiveCode('erase')} className={`px-3 py-1 rounded text-sm font-medium whitespace-nowrap ${activeCode === 'erase' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>list::erase</button>
                <button onClick={() => setActiveCode('clear')} className={`px-3 py-1 rounded text-sm font-medium whitespace-nowrap ${activeCode === 'clear' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>list::clear</button>
                <button onClick={() => setActiveCode('find')} className={`px-3 py-1 rounded text-sm font-medium whitespace-nowrap ${activeCode === 'find' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>búsqueda</button>
              </div>
              <div className="overflow-x-auto">
                <CodeBlock code={
                  activeCode === 'insert' ? (isDoublyLinked ? INSERT_DLL : INSERT_SLL) :
                  activeCode === 'erase' ? (isDoublyLinked ? ERASE_DLL : ERASE_SLL) :
                  activeCode === 'find' ? FIND_CODE :
                  CLEAR_CODE
                } />
              </div>
            </div>

          </div>
          
        </div>

        {/* Interfaz Básica */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl mt-6">
          <h2 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
            <Info className="w-5 h-5 text-indigo-400" />
            Interfaz Básica
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50">
              <h3 className="font-mono text-indigo-400 font-semibold mb-2 text-base">insert(p, x)</h3>
              <p className="text-justify text-slate-400 leading-relaxed">
                Inserta el elemento <code className="text-emerald-400">x</code> en la posición <code className="text-indigo-300">p</code>, devolviendo una posición <code className="text-indigo-300">q</code> al elemento insertado. Todas las posiciones de <code className="text-indigo-300">p</code> en adelante (incluyendo <code className="text-indigo-300">p</code>) pasan a ser inválidas, por eso la función devuelve a <code className="text-indigo-300">q</code>, la nueva posición insertada. Es válido insertar en cualquier posición dereferenciable o no dereferenciable (incluyendo la posición ficticia).
              </p>
            </div>
            
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50">
              <h3 className="font-mono text-indigo-400 font-semibold mb-2 text-base">erase(p)</h3>
              <p className="text-justify text-slate-400 leading-relaxed">
                Elimina el elemento en la posición <code className="text-indigo-300">p</code>, devolviendo una posición <code className="text-indigo-300">q</code> al elemento que previamente estaba en la posición siguiente a <code className="text-indigo-300">p</code>. Todas las posiciones de <code className="text-indigo-300">p</code> en adelante pasan a ser inválidas. Solo es válido suprimir en las posiciones dereferenciables de la lista.
              </p>
            </div>
            
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50">
              <h3 className="font-mono text-indigo-400 font-semibold mb-2 text-base">retrieve(p)</h3>
              <p className="text-justify text-slate-400 leading-relaxed">
                "Recupera" el elemento en la posición <code className="text-indigo-300">p</code>, devolviendo una referencia al mismo, de manera que es válido hacer tanto <code>x = L.retrieve(p)</code> como <code>L.retrieve(p) = x</code>. Se puede aplicar a cualquier posición <code className="text-indigo-300">p</code> dereferenciable y no modifica la lista. Puede ser usado como un "valor asignable".
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50">
              <h3 className="font-mono text-indigo-400 font-semibold mb-2 text-base">next(p)</h3>
              <p className="text-justify text-slate-400 leading-relaxed">
                Dada una posición dereferenciable <code className="text-indigo-300">p</code>, devuelve la posición del siguiente elemento. Si <code className="text-indigo-300">p</code> es la última posición dereferenciable, entonces devuelve la posición ficticia. No modifica la lista.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50">
              <h3 className="font-mono text-indigo-400 font-semibold mb-2 text-base">begin()</h3>
              <p className="text-justify text-slate-400 leading-relaxed">
                Devuelve la posición del primer elemento de la lista. Si la lista está vacía, devuelve la misma posición que <code>end()</code>.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50">
              <h3 className="font-mono text-indigo-400 font-semibold mb-2 text-base">end()</h3>
              <p className="text-justify text-slate-400 leading-relaxed">
                Devuelve la posición ficticia (no dereferenciable), después del final de la lista. Representa el límite donde ya no hay elementos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

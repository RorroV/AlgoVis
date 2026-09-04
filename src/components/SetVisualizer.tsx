import React, { useState } from 'react';
import { Combine, Plus, Trash2, Info, PieChart, Binary, Network, CheckCircle2, XCircle } from 'lucide-react';

export default function SetVisualizer() {
  const [activeTab, setActiveTab] = useState<'ops' | 'bits' | 'exercise'>('ops');
  
  // Ops State
  const [setA, setSetA] = useState<number[]>([1, 2, 3, 4, 5]);
  const [setB, setSetB] = useState<number[]>([4, 5, 6, 7, 8]);
  const [inputA, setInputA] = useState('');
  const [inputB, setInputB] = useState('');

  const addA = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(inputA);
    if (!isNaN(val) && !setA.includes(val)) setSetA([...setA, val].sort((a,b)=>a-b));
    setInputA('');
  };
  const addB = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(inputB);
    if (!isNaN(val) && !setB.includes(val)) setSetB([...setB, val].sort((a,b)=>a-b));
    setInputB('');
  };
  const removeA = (val: number) => setSetA(setA.filter(x => x !== val));
  const removeB = (val: number) => setSetB(setB.filter(x => x !== val));

  const union = Array.from(new Set([...setA, ...setB])).sort((a,b)=>a-b);
  const intersection = setA.filter(x => setB.includes(x)).sort((a,b)=>a-b);
  const diffAB = setA.filter(x => !setB.includes(x)).sort((a,b)=>a-b);
  const diffBA = setB.filter(x => !setA.includes(x)).sort((a,b)=>a-b);
  const symmetricDiff = Array.from(new Set([...diffAB, ...diffBA])).sort((a,b)=>a-b);

  // Bits State
  const [bitVector, setBitVector] = useState<boolean[]>(Array(16).fill(false));
  const toggleBit = (idx: number) => {
    const newBits = [...bitVector];
    newBits[idx] = !newBits[idx];
    setBitVector(newBits);
  };
  const currentBitSet = bitVector.map((b, i) => b ? i : -1).filter(i => i !== -1);

  // Exercise State (Flat Network)
  const numNodes = 8;
  const [switchesConfig, setSwitchesConfig] = useState<'flat' | 'notflat'>('flat');
  
  const swFlat = [
    [0, 1, 2, 3, 4],
    [0, 1, 5, 6, 7],
    [2, 3, 4, 5, 6, 7]
  ];
  
  const swNotFlat = [
    [0, 2, 3, 4],
    [0, 1, 5, 7],
    [2, 3, 5, 6, 7]
  ];

  const currentSwitches = switchesConfig === 'flat' ? swFlat : swNotFlat;

  const getMissingPairs = () => {
    const missing = [];
    for (let i = 0; i < numNodes; i++) {
      for (let j = i + 1; j < numNodes; j++) {
        let found = false;
        for (const sw of currentSwitches) {
          if (sw.includes(i) && sw.includes(j)) {
            found = true;
            break;
          }
        }
        if (!found) missing.push(`(${i}, ${j})`);
      }
    }
    return missing;
  };
  const missingPairs = getMissingPairs();
  const isFlat = missingPairs.length === 0;

  return (
    <div className="p-4 md:p-8 flex flex-col items-center w-full">
      <div className="max-w-6xl w-full mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start pb-6 border-b border-slate-800">
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-white tracking-tight flex items-center gap-3">
              <Combine className="text-indigo-500 w-8 h-8" />
              Conjuntos
            </h1>
            <p className="text-justify text-slate-400 mt-2 text-sm max-w-3xl">
              Colección de elementos únicos del universo. Operaciones e implementaciones.
            </p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400 max-w-4xl">
              <p className="text-justify">
                <strong className="text-indigo-400">Características:</strong> A diferencia de las listas, un <a href="https://cplusplus.com/reference/set/set/" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">conjunto (std::set)</a> no admite elementos duplicados y no garantiza un orden específico. Las operaciones fundamentales son la <strong>Unión</strong> (<code className="text-emerald-400">A ∪ B</code>), <strong>Intersección</strong> (<code className="text-emerald-400">A ∩ B</code>) y <strong>Diferencia</strong> (<code className="text-emerald-400">A - B</code>).
              </p>
              <p className="text-justify">
                <strong className="text-purple-400">Implementaciones:</strong> 
                Pueden representarse eficientemente usando <a href="https://cplusplus.com/reference/vector/vector/" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline"><strong>Vectores de Bits (std::vector)</strong></a> (<code className="text-emerald-400">O(1)</code> si el universo es acotado), <strong>Listas Ordenadas</strong> (operaciones binarias en <code className="text-emerald-400">O(N)</code>), o <strong>Árboles de Búsqueda / Tablas Hash</strong>.
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4 lg:mt-0 bg-slate-900 p-1 rounded-lg border border-slate-800 shrink-0 self-end lg:self-auto flex-wrap">
            <button
              onClick={() => setActiveTab('ops')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'ops' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center gap-2"><PieChart className="w-4 h-4" /> Operaciones</span>
            </button>
            <button
              onClick={() => setActiveTab('bits')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'bits' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center gap-2"><Binary className="w-4 h-4" /> Vector de Bits</span>
            </button>
            <button
              onClick={() => setActiveTab('exercise')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'exercise' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center gap-2"><Network className="w-4 h-4" /> Ejercicio (Flat)</span>
            </button>
          </div>
        </header>

        {activeTab === 'ops' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl">
                <h2 className="text-lg font-medium text-white mb-4">Conjunto A</h2>
                <form onSubmit={addA} className="flex gap-2 mb-4">
                  <input
                    type="number"
                    value={inputA}
                    onChange={(e) => setInputA(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                    placeholder="Agregar elemento..."
                  />
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors">
                    <Plus className="w-5 h-5" />
                  </button>
                </form>
                <div className="flex flex-wrap gap-2">
                  {setA.length === 0 && <span className="text-slate-500 italic text-sm">Conjunto vacío ∅</span>}
                  {setA.map(val => (
                    <div key={val} className="group relative bg-indigo-500/20 border border-indigo-500/50 text-indigo-300 px-3 py-1.5 rounded-lg font-mono font-medium flex items-center gap-2 pr-8 cursor-default">
                      {val}
                      <button onClick={() => removeA(val)} className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-indigo-400 hover:text-rose-400 hover:bg-rose-500/20 rounded opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl">
                <h2 className="text-lg font-medium text-white mb-4">Conjunto B</h2>
                <form onSubmit={addB} className="flex gap-2 mb-4">
                  <input
                    type="number"
                    value={inputB}
                    onChange={(e) => setInputB(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                    placeholder="Agregar elemento..."
                  />
                  <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors">
                    <Plus className="w-5 h-5" />
                  </button>
                </form>
                <div className="flex flex-wrap gap-2">
                  {setB.length === 0 && <span className="text-slate-500 italic text-sm">Conjunto vacío ∅</span>}
                  {setB.map(val => (
                    <div key={val} className="group relative bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 px-3 py-1.5 rounded-lg font-mono font-medium flex items-center gap-2 pr-8 cursor-default">
                      {val}
                      <button onClick={() => removeB(val)} className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-emerald-400 hover:text-rose-400 hover:bg-rose-500/20 rounded opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col gap-6">
              <h2 className="text-lg font-medium text-white flex items-center gap-2">
                <PieChart className="w-5 h-5 text-indigo-400" />
                Resultados Binarios
              </h2>
              
              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                  <div className="text-slate-400 text-sm mb-2 font-medium">Unión (A ∪ B)</div>
                  <div className="font-mono text-white text-sm break-all">
                    {'{ '}{union.join(', ')}{' }'}
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                  <div className="text-slate-400 text-sm mb-2 font-medium">Intersección (A ∩ B)</div>
                  <div className="font-mono text-white text-sm break-all">
                    {'{ '}{intersection.join(', ')}{' }'}
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                  <div className="text-slate-400 text-sm mb-2 font-medium">Diferencia (A - B)</div>
                  <div className="font-mono text-white text-sm break-all">
                    {'{ '}{diffAB.join(', ')}{' }'}
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                  <div className="text-slate-400 text-sm mb-2 font-medium">Diferencia Simétrica</div>
                  <div className="font-mono text-white text-sm break-all">
                    {'{ '}{symmetricDiff.join(', ')}{' }'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bits' && (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6">
            <div className="mb-6 flex flex-col lg:flex-row justify-between items-start gap-4">
              <div>
                <h2 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                  <Binary className="w-5 h-5 text-indigo-400" />
                  Implementación por Vectores de Bits
                </h2>
                <p className="text-justify text-sm text-slate-400 max-w-2xl">
                  Si el universo está acotado (ej. números del 0 al 15), podemos representar un conjunto usando un array de booleanos. Las operaciones de inserción, supresión y búsqueda son <strong className="text-emerald-400">O(1)</strong>.
                </p>
              </div>
              <div className="bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 font-mono text-indigo-300 text-sm w-full lg:w-auto overflow-x-auto whitespace-nowrap">
                S = {'{ '}{currentBitSet.join(', ')}{' }'}
              </div>
            </div>

            <div className="grid grid-cols-8 md:grid-cols-16 gap-1 md:gap-2 mb-8">
              {bitVector.map((isActive, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <span className="text-xs text-slate-500 font-mono">{idx}</span>
                  <button
                    onClick={() => toggleBit(idx)}
                    className={`w-full aspect-square rounded-md border flex items-center justify-center font-mono text-xs md:text-sm font-bold transition-all ${
                      isActive 
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                        : 'bg-slate-950 border-slate-800 text-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    {isActive ? '1' : '0'}
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-start gap-3">
              <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-sm text-slate-300">
                <p className="text-justify mb-2">Las operaciones binarias son muy eficientes usando operadores a nivel de bits (bitwise):</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-400">
                  <li><strong>Unión:</strong> <code>C.v[j] = A.v[j] || B.v[j]</code></li>
                  <li><strong>Intersección:</strong> <code>C.v[j] = A.v[j] && B.v[j]</code></li>
                  <li><strong>Diferencia:</strong> <code>C.v[j] = A.v[j] && !B.v[j]</code></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'exercise' && (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6">
            <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <Network className="w-5 h-5 text-indigo-400" />
              Aplicación Práctica: Predicado Flat (Ej. Guía Práctica)
            </h2>
            <p className="text-justify text-sm text-slate-400 max-w-3xl mb-6">
              Verifica en una red interconectada por switches si cada par de nodos <code>(j, k)</code> está conectado en forma directa por al menos un switch. Representamos cada switch como un <strong>conjunto de nodos</strong>.
            </p>

            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setSwitchesConfig('flat')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors border ${
                  switchesConfig === 'flat' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                Ejemplo 1 (Flat)
              </button>
              <button
                onClick={() => setSwitchesConfig('notflat')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors border ${
                  switchesConfig === 'notflat' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                Ejemplo 2 (No Flat)
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-300">Conjuntos por Switch (Total {numNodes} nodos):</h3>
                <div className="flex flex-col gap-3">
                  {currentSwitches.map((sw, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                      <div className="text-xs text-slate-500 mb-2">Switch {idx}</div>
                      <div className="flex flex-wrap gap-2">
                        {sw.map(n => (
                          <div key={n} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-mono text-slate-300 font-bold">
                            {n}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-medium text-slate-300">Resultado del Predicado <code>flat(sw, 8)</code>:</h3>
                
                {isFlat ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 flex flex-col items-center justify-center text-center gap-4 flex-1">
                    <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                    <div>
                      <h4 className="text-emerald-400 font-bold text-xl mb-2">TRUE</h4>
                      <p className="text-justify text-emerald-500/80 text-sm max-w-sm">Todos los pares de nodos posibles (de 0 a 7) comparten al menos un switch.</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-6 flex flex-col items-center justify-center text-center gap-4 flex-1">
                    <XCircle className="w-16 h-16 text-rose-500" />
                    <div>
                      <h4 className="text-rose-400 font-bold text-xl mb-2">FALSE</h4>
                      <p className="text-justify text-rose-500/80 text-sm max-w-sm mb-4">Faltan conexiones directas entre los siguientes pares de nodos:</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {missingPairs.map((pair, i) => (
                          <span key={i} className="bg-rose-500/20 text-rose-300 text-xs font-mono px-2 py-1 rounded">
                            {pair}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

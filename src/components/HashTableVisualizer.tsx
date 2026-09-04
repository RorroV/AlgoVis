import React, { useState } from 'react';
import { Hash, Plus, Info, Minus, UserCircle, Briefcase, FileCode2, Search } from 'lucide-react';

const UNSORTED_CODE = [
  "// Búsqueda Lineal en vector no ordenado",
  "iterator_t p = begin();",
  "while (p != end()) {",
  "  if (p->first == key) return p;",
  "  p = next(p);",
  "}",
  "return end();",
  "",
  "// Inserción en vector no ordenado",
  "iterator_t p = find(key);",
  "if (p == end()) {",
  "  insert(end(), pair_t(key, val));",
  "}"
];

const SORTED_CODE = [
  "// Búsqueda Binaria en vector ordenado (lower_bound)",
  "int p = 0, q = v.size(), r;",
  "while (q - p > 1) {",
  "  r = (p + q) / 2;",
  "  if (key > v[r].first) p = r;",
  "  else if (key < v[r].first) q = r;",
  "  else return r;",
  "}",
  "if (v[p].first == key) return p;",
  "return q;",
  "",
  "// Inserción en vector ordenado",
  "iterator_t p = lower_bound(key);",
  "if (p == v.size() || v[p].first != key) {",
  "  // Desplazar elementos a la derecha",
  "  for (int q = v.size(); q > p; --q) v[q] = v[q-1];",
  "  v[p] = pair_t(key, val);",
  "}"
];

interface Pair {
  key: number;
  val: number;
}

export default function HashTableVisualizer() {
  const [activeTab, setActiveTab] = useState<'unsorted' | 'sorted'>('sorted');
  const [pairs, setPairs] = useState<Pair[]>([
    { key: 13323421, val: 2500 },
    { key: 14203323, val: 2000 },
    { key: 32423233, val: 5000 }
  ].sort((a, b) => a.key - b.key));
  const [inputKey, setInputKey] = useState('');
  const [inputVal, setInputVal] = useState('');
  
  const [activeCode, setActiveCode] = useState<'unsorted' | 'sorted'>('sorted');
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [bounds, setBounds] = useState<{p: number, q: number, r?: number} | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);

  const delay = 600;

  const yieldStep = async (line: number | null, pIdx?: number | null) => {
    setActiveLine(line);
    if (pIdx !== undefined) setActiveIdx(pIdx);
    await new Promise(r => setTimeout(r, delay));
  };

  const handleInsertUnsorted = async (k: number, v: number) => {
    setActiveCode('unsorted');
    await yieldStep(1, 0); // p = begin()
    
    let found = false;
    for (let i = 0; i < pairs.length; i++) {
      await yieldStep(2, i); // while
      await yieldStep(3, i); // if == key
      if (pairs[i].key === k) {
        found = true;
        setPairs(prev => {
          const np = [...prev];
          np[i].val = v;
          return np;
        });
        break;
      }
      await yieldStep(4, i); // p = next(p)
    }
    
    if (!found) {
      await yieldStep(6, null); // return end()
      await yieldStep(9, null); // p = find(key)
      await yieldStep(10, null); // if p == end
      await yieldStep(11, null); // insert end
      setPairs(prev => [...prev, { key: k, val: v }]);
    }
    setActiveLine(null);
    setActiveIdx(null);
  };

  const handleInsertSorted = async (k: number, v: number) => {
    setActiveCode('sorted');
    await yieldStep(1, null); // int p = 0, q = size
    
    let p = 0;
    let q = pairs.length;
    
    setBounds({p, q});
    
    while (q - p > 1) {
      await yieldStep(2, null); // while (q-p > 1)
      let r = Math.floor((p + q) / 2);
      setBounds({p, q, r});
      await yieldStep(3, r); // r = (p+q)/2
      
      await yieldStep(4, r); // if key >
      if (k > pairs[r].key) {
        p = r;
      } else {
        await yieldStep(5, r); // else if key <
        if (k < pairs[r].key) {
          q = r;
        } else {
          await yieldStep(6, r); // return r
          p = r; // found exactly at r
          break;
        }
      }
      setBounds({p, q});
    }
    
    await yieldStep(8, p); // if == key
    
    if (p < pairs.length && pairs[p].key === k) {
      // found
      setPairs(prev => {
        const np = [...prev];
        np[p].val = v;
        return np;
      });
    } else {
      let insertPos = p;
      if (p < pairs.length && pairs[p].key < k) {
        insertPos = q; // insert at q
      }
      await yieldStep(9, insertPos); // return q (or p)
      
      await yieldStep(12, insertPos); // p = lower_bound
      await yieldStep(13, insertPos); // if (p == size || != key)
      await yieldStep(15, insertPos); // for displace
      
      setPairs(prev => {
        const np = [...prev];
        np.splice(insertPos, 0, { key: k, val: v });
        return np;
      });
      
      await yieldStep(16, insertPos); // v[p] = pair
    }

    setBounds(null);
    setActiveLine(null);
    setActiveIdx(null);
  };

  const handleInsert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPlaying || !inputKey || !inputVal) return;
    const k = Number(inputKey);
    const v = Number(inputVal);
    setInputKey('');
    setInputVal('');
    setIsPlaying(true);
    
    if (activeTab === 'unsorted') {
      await handleInsertUnsorted(k, v);
    } else {
      await handleInsertSorted(k, v);
    }
    
    setIsPlaying(false);
  };

  const handleSimulateOperator = () => {
    if (isPlaying || !inputKey) return;
    const k = Number(inputKey);
    // Simulate val = map[key] behavior: if it doesn't exist, create it with 0
    if (!pairs.some(p => p.key === k)) {
      handleInsertUnsorted(k, 0); // visually animate it
    }
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
              <Hash className="text-indigo-500 w-8 h-8" />
              Correspondencias (Map)
            </h1>
            <p className="text-justify text-slate-400 mt-2 text-sm max-w-3xl">
              Asociación de claves (dominio) a valores (rango). Implementación lineal.
            </p>
            <div className="mt-4 flex flex-col gap-2 text-sm text-slate-400 max-w-3xl">
              <p className="text-justify">
                <strong className="text-indigo-400">Caso de uso (Nómina):</strong> Útil cuando no se puede calcular el rango a partir del dominio. Ejemplo: Mapear un <strong>Número de Documento</strong> (Clave) al <strong>Sueldo</strong> (Valor) del empleado. La estructura estándar es <a href="https://cplusplus.com/reference/map/map/" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline"><code>std::map</code></a>.
              </p>
              <p className="text-justify">
                <strong className="text-emerald-400">Trampa (Operador [ ]):</strong> En C++, si haces <a href="https://cplusplus.com/reference/map/map/operator[]/" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline"><code>val = M[key]</code></a> y la clave no existe, <strong>¡se crea automáticamente!</strong> con un valor por defecto. Usa <a href="https://cplusplus.com/reference/map/map/find/" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline"><code>M.find()</code></a> si sólo quieres buscar.
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0 bg-slate-900 p-1 rounded-lg border border-slate-800 shrink-0">
            <button
              onClick={() => { setActiveTab('unsorted'); setPairs([]); setActiveCode('unsorted'); }}
              disabled={isPlaying}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'unsorted' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white disabled:opacity-50'}`}
            >
              No Ordenado
            </button>
            <button
              onClick={() => { setActiveTab('sorted'); setPairs([]); setActiveCode('sorted'); }}
              disabled={isPlaying}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'sorted' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white disabled:opacity-50'}`}
            >
              Ordenado (Búsqueda Binaria)
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Controls */}
          <div className="lg:col-span-1 flex flex-col gap-6">

            {/* Form */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
              <h2 className="text-lg font-medium text-white mb-4">Operaciones</h2>
              <form onSubmit={handleInsert} className="space-y-2">
                <input
                  type="number"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:border-indigo-500 transition-colors mb-2"
                  placeholder="DNI (Clave)"
                  disabled={isPlaying}
                />
                <input
                  type="number"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:border-indigo-500 transition-colors mb-2"
                  placeholder="Sueldo (Valor)"
                  disabled={isPlaying}
                />
                <button
                  type="submit"
                  disabled={isPlaying || !inputKey || !inputVal}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" /> Asignar (M[key] = val)
                </button>
              </form>
              <button
                onClick={handleSimulateOperator}
                disabled={isPlaying || !inputKey}
                className="w-full flex items-center justify-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                <Search className="w-4 h-4" /> Leer M[key]
              </button>
            </div>
          </div>

          {/* Visualization & Code Area */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl flex-1 flex flex-col min-h-[300px] overflow-hidden relative">
              <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center text-slate-400 text-sm">
                <span>Contenedor: vector&lt;pair_t&gt;</span>
                {bounds && <span className="font-mono text-amber-400">Búsqueda Binaria: p={bounds.p}, q={bounds.q}{bounds.r !== undefined ? `, r=${bounds.r}` : ''}</span>}
              </div>
              <div className="flex-1 p-8 flex flex-wrap gap-4 overflow-y-auto content-start">
                {pairs.length === 0 ? (
                  <div className="text-slate-500 font-medium m-auto">Vacío</div>
                ) : (
                  pairs.map((pair, idx) => {
                    const isActive = activeIdx === idx;
                    const isR = bounds?.r === idx;
                    const isP = bounds?.p === idx;
                    const isQ = bounds?.q === idx;
                    const inRange = bounds ? (idx >= bounds.p && idx < bounds.q) : true;
                    
                    return (
                      <div
                        key={idx}
                        className={`flex flex-col rounded-lg border-2 transition-all duration-300 w-36 shadow-lg
                          ${isActive ? 'border-amber-400 scale-110 z-10 shadow-[0_0_20px_rgba(251,191,36,0.3)]' : 
                            isR ? 'border-emerald-400' :
                            !inRange ? 'border-slate-800 opacity-30' :
                            'border-indigo-500/50'
                          }
                        `}
                      >
                        <div className="bg-slate-950 px-2 py-1 flex justify-between text-[10px] text-slate-500 border-b border-slate-800/50 font-mono">
                          <span>idx: {idx}</span>
                          <span className="font-bold flex gap-1">
                            {isP && <span className="text-indigo-400">p</span>}
                            {isR && <span className="text-emerald-400">r</span>}
                            {isQ && <span className="text-rose-400">q</span>}
                          </span>
                        </div>
                        <div className="bg-slate-800 p-2 flex flex-col items-center">
                          <span className="text-[10px] text-slate-400 flex items-center gap-1"><UserCircle className="w-3 h-3"/> DNI (Key)</span>
                          <span className={`font-mono text-lg font-bold ${isActive ? 'text-amber-400' : 'text-white'}`}>{pair.key}</span>
                        </div>
                        <div className="bg-slate-800/80 border-t border-slate-700 p-2 flex flex-col items-center">
                          <span className="text-[10px] text-slate-400 flex items-center gap-1"><Briefcase className="w-3 h-3"/> Sueldo (Val)</span>
                          <span className="font-mono text-md text-emerald-400 font-medium">${pair.val}</span>
                        </div>
                      </div>
                    )
                  })
                )}
                
                {bounds?.q === pairs.length && (
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-rose-500/50 rounded-lg w-36 h-full opacity-50 relative">
                    <span className="absolute top-1 right-2 font-mono text-[10px] text-rose-400 font-bold">q</span>
                    <span className="text-rose-400/50 text-sm">end()</span>
                  </div>
                )}
              </div>
            </div>

            {/* Pseudocode Row */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
              <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex gap-2 overflow-x-auto">
                <button onClick={() => setActiveCode('unsorted')} className={`shrink-0 px-3 py-1 rounded text-sm font-medium ${activeCode === 'unsorted' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>No Ordenado</button>
                <button onClick={() => setActiveCode('sorted')} className={`shrink-0 px-3 py-1 rounded text-sm font-medium ${activeCode === 'sorted' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>Ordenado</button>
              </div>
              <div className="overflow-x-auto">
                <CodeBlock code={activeCode === 'unsorted' ? UNSORTED_CODE : SORTED_CODE} />
              </div>
            </div>

          </div>
          
        </div>
      </div>
    </div>
  );
}

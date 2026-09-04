import React, { useState, useRef, useEffect } from 'react';
import { FolderTree, Plus, Info, Play, FileCode2, Network } from 'lucide-react';

interface TreeNode {
  id: string;
  value: string | number;
  left: TreeNode | null;
  right: TreeNode | null;
  x: number;
  y: number;
}

export default function BSTVisualizer() {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [inputValue, setInputValue] = useState('');
  
  const [activeTab, setActiveTab] = useState<'bst' | 'huffman' | 'code'>('bst');
  const [lispResult, setLispResult] = useState<string | null>(null);

  // Animation/Traversal state
  const [activeNodes, setActiveNodes] = useState<string[]>([]);
  const [traversalResult, setTraversalResult] = useState<(string | number)[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      });
    }
  }, []);

  const insertNode = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    
    const val = isNaN(Number(trimmed)) ? trimmed : Number(trimmed);
    setInputValue('');
    if (isPlaying) return;
    
    // Clear traversal results when modifying tree
    setTraversalResult([]);
    setLispResult(null);
    setActiveNodes([]);

    const newNode: TreeNode = {
      id: Math.random().toString(36).substr(2, 9),
      value: val,
      left: null,
      right: null,
      x: 0,
      y: 0
    };

    if (!root) {
      setRoot(newNode);
    } else {
      let current = root;
      while (true) {
        if (val < current.value) {
          if (!current.left) {
            current.left = newNode;
            break;
          }
          current = current.left;
        } else {
          if (!current.right) {
            current.right = newNode;
            break;
          }
          current = current.right;
        }
      }
      setRoot({ ...root }); // trigger re-render
    }
  };

  const clearTree = () => {
    if (isPlaying) return;
    setRoot(null);
    setTraversalResult([]);
    setLispResult(null);
    setActiveNodes([]);
  };

  // Recalculate positions based on tree depth
  const updatePositions = (node: TreeNode | null, x: number, y: number, horizontalOffset: number) => {
    if (!node) return;
    node.x = x;
    node.y = y;
    if (node.left) updatePositions(node.left, x - horizontalOffset, y + 60, horizontalOffset / 2);
    if (node.right) updatePositions(node.right, x + horizontalOffset, y + 60, horizontalOffset / 2);
  };

  if (root) {
    updatePositions(root, dimensions.width / 2, 40, dimensions.width / 4);
  }

  // Traversal Algorithms
  const traverse = async (type: 'in' | 'pre' | 'post' | 'lisp') => {
    if (!root || isPlaying) return;
    
    if (type === 'lisp') {
      const generateLisp = (node: TreeNode | null): string => {
        if (!node) return '.';
        const isLeaf = !node.left && !node.right;
        if (isLeaf) return String(node.value);
        return `(${node.value} ${generateLisp(node.left)} ${generateLisp(node.right)})`;
      };
      setLispResult(generateLisp(root));
      return;
    }

    setIsPlaying(true);
    setTraversalResult([]);
    setLispResult(null);
    setActiveNodes([]);

    const result: (string | number)[] = [];
    const steps: { node: TreeNode; act: 'visit' | 'add' }[] = [];

    const buildSteps = (node: TreeNode | null) => {
      if (!node) return;
      
      steps.push({ node, act: 'visit' });
      if (type === 'pre') steps.push({ node, act: 'add' });
      
      buildSteps(node.left);
      
      if (type === 'in') steps.push({ node, act: 'add' });
      
      buildSteps(node.right);
      
      if (type === 'post') steps.push({ node, act: 'add' });
    };

    buildSteps(root);

    // Playback steps
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      setActiveNodes([step.node.id]);
      if (step.act === 'add') {
        result.push(step.node.value);
        setTraversalResult([...result]);
      }
      await new Promise(r => setTimeout(r, 600)); // Delay between steps
    }
    
    setActiveNodes([]);
    setIsPlaying(false);
  };

  // SVG Renderer helpers
  const renderLines = (node: TreeNode | null): React.ReactNode[] => {
    if (!node) return [];
    const lines: React.ReactNode[] = [];
    if (node.left) {
      lines.push(
        <line key={`l-${node.id}`} x1={node.x} y1={node.y} x2={node.left.x} y2={node.left.y} stroke="#334155" strokeWidth="2" />
      );
      lines.push(...renderLines(node.left));
    }
    if (node.right) {
      lines.push(
        <line key={`r-${node.id}`} x1={node.x} y1={node.y} x2={node.right.x} y2={node.right.y} stroke="#334155" strokeWidth="2" />
      );
      lines.push(...renderLines(node.right));
    }
    return lines;
  };

  const renderNodes = (node: TreeNode | null): React.ReactNode[] => {
    if (!node) return [];
    const nodes: React.ReactNode[] = [];
    
    const isActive = activeNodes.includes(node.id);
    
    nodes.push(
      <g key={`n-${node.id}`} className="transition-all duration-300">
        <circle 
          cx={node.x} cy={node.y} r="18" 
          fill={isActive ? "#fbbf24" : "#1e1b4b"} 
          stroke={isActive ? "#f59e0b" : "#6366f1"} 
          strokeWidth="2"
          className="transition-colors duration-300"
        />
        <text 
          x={node.x} y={node.y} 
          textAnchor="middle" dy=".3em" 
          fill={isActive ? "#000" : "#fff"} 
          fontSize="12" 
          fontFamily="monospace"
          fontWeight="bold"
        >
          {node.value}
        </text>
      </g>
    );
    
    if (node.left) nodes.push(...renderNodes(node.left));
    if (node.right) nodes.push(...renderNodes(node.right));
    
    return nodes;
  };

  const renderHuffman = () => (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6 min-h-[500px] flex flex-col md:flex-row gap-6">
      <div className="flex-1 border border-slate-800 rounded-xl bg-slate-950 p-4 overflow-auto flex items-center justify-center relative">
          <svg width="400" height="300" viewBox="0 0 400 300">
             <g stroke="#334155" strokeWidth="2">
                <line x1="200" y1="40" x2="100" y2="100" />
                <line x1="200" y1="40" x2="300" y2="100" />
                <line x1="300" y1="100" x2="250" y2="170" />
                <line x1="300" y1="100" x2="350" y2="170" />
                <line x1="250" y1="170" x2="200" y2="240" />
                <line x1="250" y1="170" x2="300" y2="240" />
             </g>
             
             <text x="140" y="65" fill="#94a3b8" fontSize="14" fontWeight="bold">0</text>
             <text x="260" y="65" fill="#94a3b8" fontSize="14" fontWeight="bold">1</text>
             <text x="265" y="130" fill="#94a3b8" fontSize="14" fontWeight="bold">0</text>
             <text x="335" y="130" fill="#94a3b8" fontSize="14" fontWeight="bold">1</text>
             <text x="215" y="200" fill="#94a3b8" fontSize="14" fontWeight="bold">0</text>
             <text x="285" y="200" fill="#94a3b8" fontSize="14" fontWeight="bold">1</text>

             <circle cx="200" cy="40" r="16" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
             <text x="200" y="40" textAnchor="middle" dy=".3em" fill="#fff" fontSize="12">1.0</text>

             <circle cx="100" cy="100" r="22" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
             <text x="100" y="100" textAnchor="middle" dy=".3em" fill="#fff" fontSize="14" fontWeight="bold">a:0.4</text>
             
             <circle cx="300" cy="100" r="16" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
             <text x="300" y="100" textAnchor="middle" dy=".3em" fill="#fff" fontSize="12">0.6</text>

             <circle cx="250" cy="170" r="16" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
             <text x="250" y="170" textAnchor="middle" dy=".3em" fill="#fff" fontSize="12">0.3</text>

             <circle cx="350" cy="170" r="22" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
             <text x="350" y="170" textAnchor="middle" dy=".3em" fill="#fff" fontSize="14" fontWeight="bold">b:0.3</text>
             
             <circle cx="200" cy="240" r="22" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
             <text x="200" y="240" textAnchor="middle" dy=".3em" fill="#fff" fontSize="14" fontWeight="bold">c:0.15</text>

             <circle cx="300" cy="240" r="22" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
             <text x="300" y="240" textAnchor="middle" dy=".3em" fill="#fff" fontSize="14" fontWeight="bold">d:0.15</text>
          </svg>
      </div>
      <div className="w-full md:w-72 space-y-4">
          <h3 className="text-white font-medium flex items-center gap-2"><Network className="w-5 h-5 text-indigo-400" />Tabla de Códigos</h3>
          <div className="space-y-2 text-sm text-slate-300">
             <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800"><span className="text-emerald-400 font-bold">a (0.4)</span><span className="font-mono bg-slate-800 px-2 py-0.5 rounded">0</span></div>
             <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800"><span className="text-emerald-400 font-bold">b (0.3)</span><span className="font-mono bg-slate-800 px-2 py-0.5 rounded">11</span></div>
             <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800"><span className="text-emerald-400 font-bold">c (0.15)</span><span className="font-mono bg-slate-800 px-2 py-0.5 rounded">100</span></div>
             <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800"><span className="text-emerald-400 font-bold">d (0.15)</span><span className="font-mono bg-slate-800 px-2 py-0.5 rounded">101</span></div>
          </div>
          <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-xs text-slate-400 leading-relaxed">
             El algoritmo de Huffman minimiza la longitud del mensaje asignando códigos más cortos a los caracteres que aparecen con mayor probabilidad. Se asegura de cumplir con la <strong>condición de prefijos</strong>, por lo que ningún código es prefijo de otro.
          </div>
      </div>
    </div>
  );

  const CODE_SNIPPETS = [
    {
      name: "Copia Recursiva (tree_copy)",
      code: `void tree_copy(tree &T, tree &Q) {\n  if (T.begin() != T.end())\n    tree_copy_aux(T.begin(), Q, Q.begin());\n}\n\niterator tree_copy_aux(iterator nq, tree<T> &TT, iterator nt) {\n  nq = insert(nq, *nt);\n  iterator ct = nt.lchild(), cq = nq.lchild();\n  while (ct != TT.end()) {\n    cq = tree_copy_aux(cq, TT, ct);\n    ct = ct.right();\n    cq = cq.right();\n  }\n  return nq;\n}`
    },
    {
      name: "Copiar Espejo (mirror_copy)",
      code: `iterator mirror_copy(tree &T, iterator nt, tree &Q, iterator nq) {\n  nq = Q.insert(nq, T.retrieve(nt));\n  iterator ct = nt.lchild(), cq = nq.lchild();\n  while (ct != T.end()) {\n    cq = mirror_copy(T, ct, Q, cq);\n    ct = ct.right();\n  }\n  return nq;\n}`
    },
    {
      name: "Poda de Impares (prune_odd)",
      code: `iterator_t prune_odd(tree &T, iterator_t n) {\n  if (T.retrieve(n) % 2) n = T.erase(n);\n  else {\n    iterator_t c = n.lchild();\n    while (c != T.end()) c = prune_odd(T, c);\n    n = n.right();\n  }\n  return n;\n}`
    }
  ];

  const renderCodeOperations = () => (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6 min-h-[500px]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {CODE_SNIPPETS.map((snippet, idx) => (
          <div key={idx} className="flex flex-col border border-slate-800 rounded-xl overflow-hidden">
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium text-slate-300">{snippet.name}</span>
            </div>
            <div className="bg-[#0f172a] p-3 md:p-4 flex-1 overflow-x-hidden">
              <div className="text-[10px] sm:text-xs md:text-sm font-mono text-emerald-300 whitespace-pre-wrap break-all sm:break-normal">
                {snippet.code}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 flex flex-col items-center w-full">
      <div className="max-w-6xl w-full mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start pb-6 border-b border-slate-800">
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-white tracking-tight flex items-center gap-3">
              <FolderTree className="text-indigo-500 w-8 h-8" />
              Árboles y Árboles Binarios
            </h1>
            <p className="text-justify text-slate-400 mt-2 text-sm max-w-3xl">
              Contenedores que organizan elementos de forma jerárquica y recursiva. 
            </p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400 max-w-4xl">
              <p className="text-justify">
                <strong className="text-indigo-400">Conceptos Básicos:</strong> Colección jerárquica de nodos. Constan de un nodo <strong>raíz</strong>, y <strong>hojas</strong> (nodos sin hijos). Sus métricas clave son la <strong>altura</strong> (camino más largo a una hoja) y la <strong>profundidad o nivel</strong> de sus nodos.
              </p>
              <p className="text-justify">
                <strong className="text-purple-400">Listados / Recorridos:</strong> Los nodos pueden ser visitados y serializados (ej. con notación Lisp) usando recorridos como el <strong>Orden Previo</strong> (raíz, hijos) u <strong>Orden Posterior</strong> (hijos, raíz).
              </p>
              <p className="text-justify">
                <strong className="text-blue-400">Árboles Binarios y Huffman:</strong> Tipo especial donde cada nodo tiene máximo dos hijos (izquierdo y derecho). Permiten implementar árboles de búsqueda y algoritmos como los <strong>Árboles de Huffman</strong> (para compresión óptima de datos con longitud de código variable).
              </p>
              <div className="flex flex-wrap gap-4 items-center bg-slate-900/50 p-2 rounded-lg border border-slate-800/50 mt-1 inline-flex">
                <span><strong className="text-slate-300">Búsqueda / Inserción BST (Promedio):</strong> <span className="font-mono text-emerald-400">O(log n)</span></span>
                <span className="text-slate-600">|</span>
                <span><strong className="text-slate-300">Peor Caso (Desbalanceado):</strong> <span className="font-mono text-rose-400">O(n)</span></span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4 lg:mt-0 bg-slate-900 p-1 rounded-lg border border-slate-800 shrink-0 self-end lg:self-auto">
            <button
              onClick={() => setActiveTab('bst')}
              disabled={isPlaying}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'bst' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Árboles y Lisp
            </button>
            <button
              onClick={() => setActiveTab('huffman')}
              disabled={isPlaying}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'huffman' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Huffman
            </button>
            <button
              onClick={() => setActiveTab('code')}
              disabled={isPlaying}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'code' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Operaciones
            </button>
          </div>
        </header>

        {activeTab === 'bst' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Controls */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl">
                <h2 className="text-lg font-medium text-white mb-4">Estructura</h2>
                
                <form onSubmit={insertNode} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Insertar Valor</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      disabled={isPlaying}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:border-indigo-500 transition-colors"
                      placeholder="Valor o Letra"
                    />
                    <button
                      type="submit"
                      disabled={isPlaying}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </form>
              
              <button
                onClick={clearTree}
                disabled={isPlaying || !root}
                className="w-full mt-4 flex items-center justify-center bg-slate-800 text-slate-300 hover:bg-slate-700 py-2.5 rounded-lg font-medium transition-colors border border-slate-700 disabled:opacity-50"
              >
                Limpiar Árbol
              </button>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl">
              <h2 className="text-lg font-medium text-white mb-4">Recorridos</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => traverse('pre')}
                    disabled={isPlaying || !root}
                    className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-indigo-600/20 hover:text-indigo-400 text-slate-300 py-2.5 rounded-lg border border-slate-700 hover:border-indigo-500/50 transition-colors disabled:opacity-50"
                  >
                    <Play className="w-4 h-4" /> Pre-order
                  </button>
                  <button
                    onClick={() => traverse('in')}
                    disabled={isPlaying || !root}
                    className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-indigo-600/20 hover:text-indigo-400 text-slate-300 py-2.5 rounded-lg border border-slate-700 hover:border-indigo-500/50 transition-colors disabled:opacity-50"
                  >
                    <Play className="w-4 h-4" /> In-order
                  </button>
                  <button
                    onClick={() => traverse('post')}
                    disabled={isPlaying || !root}
                    className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-indigo-600/20 hover:text-indigo-400 text-slate-300 py-2.5 rounded-lg border border-slate-700 hover:border-indigo-500/50 transition-colors disabled:opacity-50"
                  >
                    <Play className="w-4 h-4" /> Post-order
                  </button>
                  <button
                    onClick={() => traverse('lisp')}
                    disabled={isPlaying || !root}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 py-2.5 rounded-lg border border-indigo-500/30 transition-colors disabled:opacity-50 mt-4"
                  >
                    <FileCode2 className="w-4 h-4" /> Notación Lisp
                  </button>
                </div>
              </div>
            </div>

            {/* Visualization Area */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl flex-1 flex flex-col min-h-[300px] md:min-h-[500px] overflow-hidden relative">
                
                {/* Output Traversal Array */}
                <div className="absolute bottom-6 left-6 right-6 flex items-start gap-3">
                  <div className="text-sm font-medium text-slate-500 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 mt-1 shrink-0">Resultado:</div>
                  <div className="flex-1 flex gap-2 flex-wrap items-center">
                    {lispResult ? (
                      <div className="bg-indigo-500/20 border border-indigo-500/50 text-indigo-300 px-4 py-2 rounded font-mono font-bold animate-in zoom-in duration-300 break-all text-sm md:text-base shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                        {lispResult}
                      </div>
                    ) : (
                      traversalResult.map((val, idx) => (
                        <div 
                          key={idx}
                          className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 w-10 h-10 flex items-center justify-center font-mono rounded font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)] animate-in zoom-in duration-300 shrink-0"
                        >
                          {val}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Canvas Container */}
                <div className="flex-1 w-full" ref={containerRef}>
                  <svg width="100%" height="100%">
                    {renderLines(root)}
                    {renderNodes(root)}
                  </svg>
                  {!root && (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-600 font-medium pointer-events-none">
                      Árbol Vacío. Inserte un valor para comenzar.
                    </div>
                  )}
                </div>
                
              </div>
            </div>
            
          </div>
        )}

        {activeTab === 'huffman' && renderHuffman()}
        {activeTab === 'code' && renderCodeOperations()}

      </div>
    </div>
  );
}

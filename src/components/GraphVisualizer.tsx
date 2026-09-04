import React, { useState, useRef, useEffect } from 'react';
import { Share2, Play, Pause, RotateCcw, Code, Zap, Cpu, Square } from 'lucide-react';

interface Node {
  id: number;
  x: number;
  y: number;
  color: string;
}

interface Edge {
  u: number;
  v: number;
}

const PALETTE = [
  '#ef4444', '#3b82f6', '#22c55e', '#eab308', 
  '#a855f7', '#f97316', '#ec4899', '#14b8a6', 
  '#8b5cf6', '#06b6d4', '#f43f5e', '#84cc16'
];
const DEFAULT_COLOR = '#1e293b';

const GREEDY_CODE = [
  "void greedy(graph &G, int nv, vector<int> &tabla_color) {",
  "  int color=0;",
  "  set<int> nuevo_color, no_col;",
  "  set<int>::iterator q;",
  "  for (int k=0; k<nv; k++) no_col.insert(k);",
  "  while (1) {",
  "    greedyc(G,no_col,nuevo_color,tabla_color,color);",
  "    for (q=nuevo_color.begin(); q!=nuevo_color.end(); q++)",
  "      no_col.erase(*q);",
  "    if (!no_col.size()) return;",
  "    color++;",
  "  }",
  "}"
];

const EXHAUSTIVE_CODE = [
  "bool exhaustive(graph &G, int num_colors, vector<int> &colores, int v) {",
  "  if (v == G.nv) return true; // Todos coloreados",
  "  for (int c = 0; c < num_colors; c++) {",
  "    bool valido = true;",
  "    for (int u : G.vecinos(v)) {",
  "      if (colores[u] == c) { valido = false; break; }",
  "    }",
  "    if (valido) {",
  "      colores[v] = c;",
  "      if (exhaustive(G, num_colors, colores, v + 1)) return true;",
  "      colores[v] = -1; // Backtrack",
  "    }",
  "  }",
  "  return false;",
  "}",
  "",
  "void find_optimal(graph &G) {",
  "  vector<int> colores(G.nv, -1);",
  "  for (int k = 1; k <= G.nv; k++) {",
  "    if (exhaustive(G, k, colores, 0)) return;",
  "  }",
  "}"
];

function generateGraph(n: number) {
  const cx = 300, cy = 200, r = 160;
  const nodes: Node[] = [];
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    nodes.push({
      id: i,
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      color: DEFAULT_COLOR
    });
  }
  
  const edges: Edge[] = [];
  const edgeSet = new Set<string>();
  
  for (let i = 0; i < n; i++) {
    const next = (i + 1) % n;
    edges.push({ u: i, v: next });
    edgeSet.add(`${i}-${next}`);
    edgeSet.add(`${next}-${i}`);
  }
  
  const targetEdges = Math.min(n * 2, (n * (n - 1)) / 2);
  let attempts = 0;
  while (edges.length < targetEdges && attempts < 100) {
    attempts++;
    const u = Math.floor(Math.random() * n);
    const v = Math.floor(Math.random() * n);
    if (u !== v && !edgeSet.has(`${u}-${v}`)) {
      edges.push({ u, v });
      edgeSet.add(`${u}-${v}`);
      edgeSet.add(`${v}-${u}`);
    }
  }
  
  return { nodes, edges };
}

export default function GraphVisualizer() {
  const [numVertices, setNumVertices] = useState(7);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [activeNode, setActiveNode] = useState<number | null>(null);
  
  const [activeAlgo, setActiveAlgo] = useState<'greedy' | 'exhaustive'>('greedy');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeLine, setActiveLine] = useState<number | null>(null);
  
  const abortRef = useRef(false);
  const pauseRef = useRef(false);
  const stepResolveRef = useRef<(() => void) | null>(null);
  const delayRef = useRef(400);

  // Initialize graph
  useEffect(() => {
    stopExecution();
    const { nodes: newNodes, edges: newEdges } = generateGraph(numVertices);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [numVertices]);

  const getAdjacencyList = () => {
    const adj: Record<number, number[]> = {};
    nodes.forEach(n => adj[n.id] = []);
    edges.forEach(e => {
      adj[e.u].push(e.v);
      adj[e.v].push(e.u);
    });
    return adj;
  };

  const yieldStep = async (line: number | null, msg?: string) => {
    if (abortRef.current) throw new Error('Abort');
    if (line !== null) setActiveLine(line);
    
    await new Promise(r => setTimeout(r, delayRef.current));
    
    while (pauseRef.current) {
      await new Promise<void>(r => { stepResolveRef.current = r; });
      if (abortRef.current) throw new Error('Abort');
    }
  };

  const stopExecution = () => {
    abortRef.current = true;
    setIsPlaying(false);
    setIsPaused(false);
    pauseRef.current = false;
    setActiveLine(null);
    if (stepResolveRef.current) {
      stepResolveRef.current();
      stepResolveRef.current = null;
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      if (isPaused) {
        setIsPaused(false);
        pauseRef.current = false;
        if (stepResolveRef.current) {
          stepResolveRef.current();
          stepResolveRef.current = null;
        }
      } else {
        setIsPaused(true);
        pauseRef.current = true;
      }
    } else {
      if (activeAlgo === 'greedy') runGreedy();
      else runExhaustive();
    }
  };

  const handleStop = () => {
    stopExecution();
    setNodes(nodes.map(n => ({ ...n, color: DEFAULT_COLOR })));
  };

  const runGreedy = async () => {
    stopExecution();
    await new Promise(r => setTimeout(r, 50));
    
    setIsPlaying(true);
    setIsPaused(false);
    pauseRef.current = false;
    abortRef.current = false;
    
    const currentNodes = [...nodes].map(n => ({ ...n, color: DEFAULT_COLOR }));
    setNodes(currentNodes);
    const adj = getAdjacencyList();
    
    try {
      await yieldStep(0, "Iniciando algoritmo heurístico ávido...");
      await yieldStep(1, "int color=0;");
      let colorIndex = 0;
      
      await yieldStep(2, "set<int> nuevo_color, no_col;");
      let noCol = new Set(currentNodes.map(n => n.id));
      
      await yieldStep(4, "for (int k=0; k<nv; k++) no_col.insert(k);");
      
      while (true) {
        await yieldStep(5, "while (1) {");
        await yieldStep(6, `greedyc(G, no_col, nuevo_color, tabla_color, ${colorIndex}); // Buscando independientes`);
        
        let nuevoColor = new Set<number>();
        for (let q of noCol) {
           if (abortRef.current) throw new Error('Abort');
           setActiveNode(q);
           let adyacente = false;
           for (let w of nuevoColor) {
              if (adj[q].includes(w)) { adyacente = true; break; }
           }
           if (!adyacente) {
              nuevoColor.add(q);
              const nIdx = currentNodes.findIndex(n => n.id === q);
              currentNodes[nIdx].color = PALETTE[colorIndex % PALETTE.length];
              setNodes([...currentNodes]);
              await yieldStep(6, `> Vértice ${q} coloreado (Color ${colorIndex})`);
           }
           await new Promise(r => setTimeout(r, delayRef.current / 2));
        }
        setActiveNode(null);
        
        await yieldStep(7, "for (q=nuevo_color.begin(); q!=nuevo_color.end(); q++)");
        await yieldStep(8, "  no_col.erase(*q);");
        for (let q of nuevoColor) {
           noCol.delete(q);
        }
        
        await yieldStep(9, "if (!no_col.size()) return;");
        if (noCol.size === 0) {
           await yieldStep(null, `¡Fin! Algoritmo finalizado usando ${colorIndex + 1} colores.`);
           break;
        }
        
        await yieldStep(10, "color++;");
        colorIndex++;
      }
    } catch(e) {
       // Aborted silently
    } finally {
       setIsPlaying(false);
       setActiveNode(null);
    }
  };

  const runExhaustive = async () => {
    stopExecution();
    await new Promise(r => setTimeout(r, 50));
    
    setIsPlaying(true);
    setIsPaused(false);
    pauseRef.current = false;
    abortRef.current = false;
    
    const currentNodes = [...nodes].map(n => ({ ...n, color: DEFAULT_COLOR }));
    setNodes(currentNodes);
    const adj = getAdjacencyList();
    
    try {
      await yieldStep(16, "void find_optimal(graph &G) {");
      await yieldStep(17, "vector<int> colores(G.nv, -1);");
      const colores = Array(currentNodes.length).fill(-1);
      
      for (let k = 1; k <= currentNodes.length; k++) {
        await yieldStep(18, `for (int k=1; k<=G.nv; k++) { // Probando límite = ${k}`);
        
        const backtrack = async (v: number): Promise<boolean> => {
           if (abortRef.current) throw new Error('Abort');
           setActiveNode(v < currentNodes.length ? currentNodes[v].id : null);
           await yieldStep(0, `exhaustive(G, ${k}, colores, ${v})`);
           await yieldStep(1, "if (v == G.nv) return true;");
           
           if (v === currentNodes.length) return true;
           
           for (let c = 0; c < k; c++) {
              await yieldStep(2, `for (int c=0; c<num_colors; c++) { // Evaluando color ${c} para v=${currentNodes[v].id}`);
              await yieldStep(3, "bool valido = true;");
              let valido = true;
              
              await yieldStep(4, "for (int u : G.vecinos(v)) {");
              for (let neighborId of adj[currentNodes[v].id]) {
                 const u = currentNodes.findIndex(n => n.id === neighborId);
                 if (colores[u] === c) {
                    await yieldStep(5, `> Conflicto detectado con vértice ${currentNodes[u].id}`);
                    valido = false;
                    break;
                 }
              }
              
              await yieldStep(7, "if (valido) {");
              if (valido) {
                 await yieldStep(8, "colores[v] = c;");
                 colores[v] = c;
                 currentNodes[v].color = PALETTE[c];
                 setNodes([...currentNodes]);
                 
                 await yieldStep(9, "if (exhaustive(G, num_colors, colores, v + 1)) return true;");
                 if (await backtrack(v + 1)) return true;
                 
                 setActiveNode(currentNodes[v].id);
                 await yieldStep(10, `colores[v] = -1; // Backtrack en v=${currentNodes[v].id}`);
                 colores[v] = -1;
                 currentNodes[v].color = DEFAULT_COLOR;
                 setNodes([...currentNodes]);
              }
           }
           
           await yieldStep(13, "return false;");
           return false;
        };
        
        await yieldStep(19, `if (exhaustive(G, ${k}, colores, 0)) return;`);
        if (await backtrack(0)) {
           await yieldStep(null, `¡Óptimo encontrado! Se requieren ${k} colores.`);
           break;
        } else {
           await yieldStep(null, `Fallo: Imposible con ${k} colores.`);
        }
      }
    } catch(e) {
       // Aborted silently
    } finally {
       setIsPlaying(false);
       setActiveNode(null);
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
    <div className="min-h-screen bg-[#0a0f1c] p-6 lg:p-8 selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start pb-6 border-b border-slate-800">
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-white tracking-tight flex items-center gap-3">
              <Share2 className="text-indigo-500 w-8 h-8" />
              Grafos: Análisis de Coloración
            </h1>
            <p className="text-justify text-slate-400 mt-2 text-sm max-w-3xl">
              Simulación paso a paso comparando el Algoritmo Heurístico Ávido y la Búsqueda Exhaustiva con visualización de pseudocódigo en tiempo real.
            </p>
            <div className="mt-4 flex flex-col gap-2 text-sm text-slate-400 max-w-3xl">
              {activeAlgo === 'greedy' ? (
                <>
                  <p className="text-justify">
                    <strong className="text-indigo-400">Heurístico Ávido:</strong> La heurística ávida trata de colorear el mayor número de vértices posibles con el primer color, luego pasa al segundo, y así sucesivamente. Para cada color, evalúa secuencialmente los vértices en <code>no_col</code> (un <a href="https://cplusplus.com/reference/set/set/" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline"><code>std::set</code></a>) y los agrupa si no hay conflictos con sus vecinos que ya posean dicho color (conjuntos independientes).
                  </p>
                  <div className="flex gap-4">
                    <span><strong>Complejidad:</strong> <span className="font-mono text-emerald-400">O(V + E)</span></span>
                    <span className="text-slate-600">|</span>
                    <span><strong>Garantiza Óptimo:</strong> <span className="text-rose-400">No</span></span>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-justify">
                    <strong className="text-purple-400">Búsqueda Exhaustiva:</strong> La búsqueda exhaustiva iterativa evalúa el espacio de soluciones intentando colorear el grafo con 1 solo color; si el backtracking falla (retorna false), lo intenta con 2, y así sucesivamente. Al probar las combinaciones, garantiza encontrar el <b>coloreado óptimo</b>.
                  </p>
                  <div className="flex gap-4">
                    <span><strong>Complejidad:</strong> <span className="font-mono text-rose-400">O(m^V)</span></span>
                    <span className="text-slate-600">|</span>
                    <span><strong>Garantiza Óptimo:</strong> <span className="text-emerald-400">Sí</span></span>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column: Controls & Console */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
              <h2 className="text-lg font-medium text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-indigo-400" /> Ejecutar Algoritmo
              </h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 flex justify-between">
                    <span>Número de Vértices:</span>
                    <span className="text-white font-bold">{numVertices}</span>
                  </label>
                  <input 
                    type="range" min="4" max="12" step="1" 
                    value={numVertices} 
                    onChange={e => setNumVertices(parseInt(e.target.value))}
                    disabled={isPlaying}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { stopExecution(); setActiveAlgo('greedy'); }}
                    disabled={isPlaying}
                    className={`py-2 px-2 rounded-lg text-xs font-medium transition-colors border flex items-center justify-center gap-1
                      ${activeAlgo === 'greedy' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'}`}
                  >
                    <Zap className="w-3 h-3" /> Ávido
                  </button>
                  <button
                    onClick={() => { stopExecution(); setActiveAlgo('exhaustive'); }}
                    disabled={isPlaying}
                    className={`py-2 px-2 rounded-lg text-xs font-medium transition-colors border flex items-center justify-center gap-1
                      ${activeAlgo === 'exhaustive' ? 'bg-purple-600/20 border-purple-500 text-purple-300' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'}`}
                  >
                    <Cpu className="w-3 h-3" /> Exhaustiva
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 flex justify-between">
                    <span>Velocidad de ejecución</span>
                  </label>
                  <input 
                    type="range" min="50" max="1000" step="50" 
                    value={1050 - delayRef.current} 
                    onChange={e => {
                       delayRef.current = 1050 - parseInt(e.target.value);
                    }}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handlePlayPause}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all shadow-lg
                      ${isPlaying && !isPaused ? 'bg-amber-500 hover:bg-amber-600 text-amber-950 shadow-amber-900/50' : 'bg-emerald-500 hover:bg-emerald-600 text-emerald-950 shadow-emerald-900/50'}`}
                  >
                    {isPlaying && !isPaused ? <><Pause className="w-5 h-5"/> Pausar</> : <><Play className="w-5 h-5" fill="currentColor"/> {isPlaying ? 'Reanudar' : 'Iniciar'}</>}
                  </button>
                  <button
                    onClick={handleStop}
                    disabled={!isPlaying}
                    className="px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 border border-rose-500/20"
                    title="Detener y Reiniciar"
                  >
                    <Square className="w-5 h-5" fill="currentColor" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Graph Visualizer */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl flex flex-col h-[300px] md:h-[400px] overflow-hidden relative p-4">
              <svg width="100%" height="100%" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet">
                {edges.map((edge, i) => {
                  const u = nodes.find(n => n.id === edge.u)!;
                  const v = nodes.find(n => n.id === edge.v)!;
                  const isHighlighted = activeNode === u.id || activeNode === v.id;
                  return (
                    <line 
                      key={`edge-${i}`} 
                      x1={u.x} y1={u.y} x2={v.x} y2={v.y} 
                      stroke={isHighlighted ? "#6366f1" : "#334155"} 
                      strokeWidth={isHighlighted ? "4" : "2"}
                      className="transition-all duration-300"
                    />
                  );
                })}
                {nodes.map(node => {
                  const isActive = activeNode === node.id;
                  return (
                    <g key={`node-${node.id}`} className="transition-all duration-300">
                      <circle 
                        cx={node.x} cy={node.y} r={isActive ? "26" : "22"}
                        fill={node.color} 
                        stroke={isActive ? "#fff" : (node.color === DEFAULT_COLOR ? "#475569" : "transparent")} 
                        strokeWidth="4"
                        className="transition-all duration-300"
                      />
                      <text 
                        x={node.x} y={node.y} 
                        textAnchor="middle" dy=".3em" 
                        fill="#fff" 
                        fontSize="14" 
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {node.id}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Pseudocode Row */}
            <div className="flex-1 w-full">
              <CodeBlock code={activeAlgo === 'greedy' ? GREEDY_CODE : EXHAUSTIVE_CODE} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

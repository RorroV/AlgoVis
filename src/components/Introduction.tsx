import React from 'react';
import { Target, BookOpen, Layers, Share2, LinkIcon, Hash, FolderTree, BarChart2, TrendingUp, Box, ArrowDown, ArrowUp } from 'lucide-react';

export default function Introduction() {
  return (
    <div className="p-4 md:p-8 flex flex-col items-center w-full">
      <div className="max-w-6xl w-full mx-auto space-y-8">
        
        {/* Header */}
        <header className="pb-6 border-b border-slate-800">
          <h1 className="text-3xl font-semibold text-white tracking-tight flex items-center gap-3">
            <BookOpen className="text-indigo-500 w-8 h-8" />
            Introducción a Estructuras de Datos
          </h1>
          <p className="text-justify text-slate-400 mt-3 text-sm max-w-3xl leading-relaxed">
            Un entorno interactivo para explorar el funcionamiento y los costos computacionales de los principales algoritmos y estructuras de datos.
          </p>
        </header>

        {/* Objetivo */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
          <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            Objetivo de la aplicación
          </h2>
          <p className="text-justify text-sm text-slate-300 leading-relaxed">
            El objetivo central de esta aplicación es <strong>modelizar visualmente las estructuras de datos</strong> y constituir una <strong>herramienta pedagógica de apoyo</strong>. A través de representaciones interactivas, se busca facilitar la asimilación de conceptos abstractos, ofreciendo al estudiante la posibilidad de observar paso a paso cómo los algoritmos alteran la organización y disposición de los datos. Se elige C++ como lenguaje para las implementaciones debido a su flexibilidad pedagógica.
          </p>
        </div>

        {/* Tipos de Datos Abstractos (TAD) */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
          <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <Box className="w-5 h-5 text-indigo-400" />
            Tipos de Datos Abstractos (TAD)
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            <div className="lg:col-span-3 space-y-4 text-sm text-slate-300 leading-relaxed">
              <p className="text-justify">
                Una vez que se ha elegido un algoritmo, la implementación puede hacerse usando las estructuras más simples y comunes en casi todos los lenguajes de programación: escalares, arreglos y matrices. Sin embargo, algunos problemas se pueden plantear en forma más simple o eficiente en términos de estructuras informáticas más complejas, como <strong>listas, pilas, colas, árboles, grafos o conjuntos</strong>.
              </p>
              <p className="text-justify">
                Por ejemplo, el <em>Problema del Viajante (TSP)</em> se plantea naturalmente en términos de un grafo donde los vértices son las ciudades y las aristas los caminos que van de una ciudad a otra. Estas estructuras están incorporadas en muchos lenguajes de programación o pueden obtenerse de librerías, y suelen ofrecer implementaciones eficientes y robustas, con estimaciones bastante uniformes de sus tiempos de ejecución.
              </p>
              <p className="text-justify">
                Las funciones asociadas a cada estructura son relativamente independientes del lenguaje o la implementación en particular. Así, una vez que se plantea un algoritmo en términos de operaciones sobre una estructura, es fácil implementarlo en una variedad de lenguajes con una performance similar.
              </p>
              <p className="text-justify">
                Un <strong>"Tipo Abstracto de Datos" (TAD)</strong> es la descripción matemática de un objeto abstracto, definido por las operaciones que actúan sobre el mismo. Cuando usamos una estructura compleja podemos separar tres niveles de abstracción diferentes:
              </p>
            </div>
            
            {/* Esquema de Abstracción */}
            <div className="lg:col-span-2 flex items-center justify-center p-6 bg-slate-950/50 rounded-xl border border-slate-800/50">
              <div className="flex items-stretch justify-center gap-8">
                {/* Cajas y flechas hacia abajo */}
                <div className="flex flex-col items-center">
                  <div className="bg-slate-800 border border-slate-700 rounded-md px-6 py-3 text-center w-56 shadow-lg text-white font-medium text-sm">
                    operaciones abstractas<br/>del TAD
                  </div>
                  <div className="py-2 text-slate-500">
                    <ArrowDown className="w-5 h-5" />
                  </div>
                  <div className="bg-slate-800 border border-slate-700 rounded-md px-6 py-3 text-center w-40 shadow-lg text-white font-medium text-sm">
                    interfase
                  </div>
                  <div className="py-2 text-slate-500">
                    <ArrowDown className="w-5 h-5" />
                  </div>
                  <div className="bg-slate-800 border border-slate-700 rounded-md px-6 py-3 text-center w-56 shadow-lg text-white font-medium text-sm">
                    implementación
                  </div>
                </div>

                {/* Flecha de abstracción hacia arriba */}
                <div className="relative flex flex-col items-center justify-center">
                  <div className="w-0.5 bg-indigo-500 absolute top-4 bottom-4 left-1/2 -translate-x-1/2"></div>
                  <ArrowUp className="w-5 h-5 text-indigo-500 absolute top-1 left-1/2 -translate-x-1/2 bg-slate-950" />
                  <span className="[writing-mode:vertical-lr] rotate-180 text-indigo-400 font-semibold tracking-widest bg-slate-950 py-4 px-1 z-10 text-xs shadow-lg rounded">
                    abstracción
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Temario Overview */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/50">
            <h2 className="text-lg font-medium text-white">Visualizaciones</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Tasas de Crecimiento */}
            <div className="flex flex-col gap-2">
              <h3 className="text-indigo-400 font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 shrink-0" /> Tasas de Crecimiento
              </h3>
              <p className="text-justify text-xs text-slate-400 leading-relaxed">
                Estudio del comportamiento asintótico de los algoritmos (Big O). Permite visualizar cómo escala el tiempo de ejecución a medida que crece el tamaño de la entrada.
              </p>
            </div>

            {/* Grafos */}
            <div className="flex flex-col gap-2">
              <h3 className="text-indigo-400 font-medium flex items-center gap-2">
                <Share2 className="w-4 h-4 shrink-0" /> Grafos
              </h3>
              <p className="text-justify text-xs text-slate-400 leading-relaxed">
                Modelado de relaciones matemáticas entre objetos (vértices y aristas). Incluye la visualización de algoritmos de coloración como Búsqueda Exhaustiva y Heurístico Ávido.
              </p>
            </div>

            {/* Listas */}
            <div className="flex flex-col gap-2">
              <h3 className="text-indigo-400 font-medium flex items-center gap-2">
                <LinkIcon className="w-4 h-4 shrink-0" /> Listas Enlazadas
              </h3>
              <p className="text-justify text-xs text-slate-400 leading-relaxed">
                Estructuras lineales donde cada elemento apunta al siguiente (y opcionalmente al anterior). Fundamental para entender la gestión de memoria dinámica y punteros.
              </p>
            </div>

            {/* Pilas y Colas */}
            <div className="flex flex-col gap-2">
              <h3 className="text-indigo-400 font-medium flex items-center gap-2">
                <Layers className="w-4 h-4 shrink-0" /> Pilas y Colas
              </h3>
              <p className="text-justify text-xs text-slate-400 leading-relaxed">
                TADs adaptadores que imponen políticas de acceso estrictas sobre secuencias de datos: LIFO (Last-In-First-Out) para Pilas y FIFO (First-In-First-Out) para Colas.
              </p>
            </div>

            {/* Correspondencias */}
            <div className="flex flex-col gap-2">
              <h3 className="text-indigo-400 font-medium flex items-center gap-2">
                <Hash className="w-4 h-4 shrink-0" /> Correspondencias
              </h3>
              <p className="text-justify text-xs text-slate-400 leading-relaxed">
                Asociación de claves únicas (dominio) a valores (rango). Herramienta visual para entender la lógica de mapeo lineal detrás de los diccionarios o mapas.
              </p>
            </div>

            {/* Árboles */}
            <div className="flex flex-col gap-2">
              <h3 className="text-indigo-400 font-medium flex items-center gap-2">
                <FolderTree className="w-4 h-4 shrink-0" /> Árboles
              </h3>
              <p className="text-justify text-xs text-slate-400 leading-relaxed">
                Contenedores que organizan elementos de forma jerárquica. Incluye árboles binarios de búsqueda, recorridos (pre/in/post-orden), notación Lisp y Árboles de Huffman.
              </p>
            </div>

            {/* Ordenamiento */}
            <div className="flex flex-col gap-2">
              <h3 className="text-indigo-400 font-medium flex items-center gap-2">
                <BarChart2 className="w-4 h-4 shrink-0" /> Algoritmos de Ordenamiento
              </h3>
              <p className="text-justify text-xs text-slate-400 leading-relaxed">
                Comparación visual de métodos clásicos de ordenamiento (Burbuja, Selección, Inserción, QuickSort), analizando sus costos de tiempo y operaciones en tiempo real.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

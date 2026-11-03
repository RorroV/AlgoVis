# 🚀 AlgoVis — Visualizador Interactivo de Algoritmos y Estructuras de Datos

<p align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/activity.svg" width="64" height="64" alt="AlgoVis Logo" />
</p>

<p align="center">
  <strong>Plataforma interactiva para el aprendizaje visual de algoritmos, estructuras de datos y análisis de complejidad asintótica.</strong>
  <br />
  <em>Interactive educational platform for visual learning of algorithms, data structures, and asymptotic complexity analysis.</em>
</p>

<p align="center">
  <a href="https://github.com/rodrigoarriondo/AlgoVis/actions/workflows/deploy.yml"><img src="https://img.shields.io/github/actions/workflow/status/rodrigoarriondo/AlgoVis/deploy.yml?branch=main&label=Deploy%20Pages&logo=githubactions&logoColor=white" alt="Deploy to GitHub Pages" /></a>
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Bun-Fast-FBF0DF?logo=bun&logoColor=black" alt="Bun" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License: MIT" />
</p>

---

## 🌐 Language / Idioma
- [English](#-english-documentation)
- [Español](#-documentación-en-español)

---

# 🇬🇧 English Documentation

## 📌 Overview

**AlgoVis** is a modern, responsive, and interactive educational tool designed to help students, developers, and computer science enthusiasts intuitively understand foundational data structures, algorithmic paradigms, and their computational complexities.

Developed originally in the context of the **Algorithms and Data Structures (AED)** academic curriculum at **FICH-UNL** (Facultad de Ingeniería y Ciencias Hídricas - Universidad Nacional del Litoral, Argentina), the application bridges abstract theoretical proofs with real-time visual step-by-step execution.

---

## ✨ Features & Modules

### 1. 📖 Introduction & Abstract Data Types (ADTs / TADs)
- Exploration of mathematical specifications vs. concrete memory representations.
- Conceptual grounding in encapsulation, state preservation, invariants, and interface contracts.

### 2. 📈 Growth Rates & Asymptotic Analysis
- Interactive plotting of standard complexity orders: $\mathcal{O}(1)$, $\mathcal{O}(\log n)$, $\mathcal{O}(n)$, $\mathcal{O}(n \log n)$, $\mathcal{O}(n^2)$, $\mathcal{O}(2^n)$, $\mathcal{O}(n!)$.
- Sliders to tweak input size $n$ and analyze execution time scaling and operational bounds ($\mathcal{O}, \Omega, \Theta$).

### 3. 🕸️ Graphs
- Interactive graph canvas supporting directed, undirected, and weighted edges.
- Visual representations: **Adjacency Matrix** vs. **Adjacency Lists**.
- Step-by-step graph traversal algorithms:
  - **BFS** (Breadth-First Search) with active frontier queue tracking.
  - **DFS** (Depth-First Search) with recursive call-stack inspection.
  - Shortest path intuition.

### 4. 🔗 Linked Lists
- Dynamic node rendering for **Singly Linked Lists** and **Doubly Linked Lists**.
- Operations visualizer: insertion at head, tail, or arbitrary index, node removal, and pointer rewiring.
- Visual demonstration of pointer traversal penalties ($\mathcal{O}(n)$ random access vs array $\mathcal{O}(1)$ indexing).

### 5. 🥞 Stacks & Queues
- **Stack (LIFO)**: `push()`, `pop()`, `peek()`, stack overflow/underflow state.
- **Queue (FIFO)**: `enqueue()`, `dequeue()`, circular buffer array implementation vs linked nodes.
- Real-world application simulations (call stack, buffer queues, backtracking).

### 6. #️⃣ Hash Tables (Correspondences / Dictionaries)
- Direct mapping from keys to hash bucket indices using hashing functions.
- Visual demonstration of collision resolution:
  - **Separate Chaining** (linked bucket lists).
  - **Open Addressing** (linear probing).
- Interactive load factor ($\alpha = n/m$) indicators and performance degradation analysis.

### 7. 🌳 Binary Search Trees (BST)
- Visual tree layouts dynamically positioned based on parent-child relationships.
- Operations: insertion, lookup, and deletion (handling 0, 1, or 2 children with in-order successors).
- Tree traversals with animated visited sequences: **In-Order**, **Pre-Order**, and **Post-Order**.

### 8. 🔄 Sets & Disjoint Sets
- Set operations: Union ($A \cup B$), Intersection ($A \cap B$), Difference ($A \setminus B$), and Cartesian product intuition.
- Venn diagram visualizer with interactive membership testing.

### 9. 📊 Sorting I (Elementary Algorithms)
- Step-by-step animated bar chart sorting:
  - **Bubble Sort**
  - **Selection Sort**
  - **Insertion Sort**
  - **QuickSort** (partitioning and pivot selection)
- **Direct vs. Indirect Sorting**: In-depth theoretical analysis comparing physical object movement in memory vs. sorting an auxiliary index array (`indx`), crucial when elements are large or expensive to swap.

### 10. ⚡ Sorting II (Advanced Sorting & Empirical Benchmarks)
- **Heapsort**: Visual breakdown of the two phases:
  1. *Build-Max-Heap* (interpreting the flat array as a complete binary tree in-place).
  2. *Extraction & Sift-Down* (swapping root with boundary and restoring heap property).
- **Mergesort**: Divide-and-conquer recursion tree with auxiliary array merge visualization.
- **Empirical Asymptotic Comparison**:
  - Interactive logarithmic graph comparing operational ratios ($T(n)/n$ vs $n$).
  - Analysis of cache locality, memory overhead, and node-pointer vs contiguous vector performance (`STL[vec]`, `heap-sort`, `merge-sort[vec]`, `quick-sort`, `merge-sort[list]`).

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations & Transitions**: [Motion](https://motion.dev/)
- **Charts & Data Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Package Manager / Runtime**: [Bun](https://bun.sh/) / [Node.js](https://nodejs.org/) (npm, pnpm, yarn compatible)
- **Continuous Deployment**: [GitHub Actions](https://github.com/features/actions) to [GitHub Pages](https://pages.github.com/)

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/) (version 18+ or 20+ recommended) OR [Bun](https://bun.sh/) (recommended for fastest builds).
- Git.

### 1. Clone the repository
```bash
git clone https://github.com/rodrigoarriondo/AlgoVis.git
cd AlgoVis
```

### 2. Install dependencies

Using **Bun** (recommended):
```bash
bun install
```

Or using **npm**:
```bash
npm install
```

### 3. Run development server
```bash
# With Bun
bun run dev

# With npm
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port indicated in your console) to explore the visualizer.

### 4. Build for production
```bash
# With Bun
bun run build

# With npm
npm run build
```
The compiled, optimized production files will be placed inside the `dist/` directory.

---

## 📦 Deployment to GitHub Pages

The repository includes a ready-to-use GitHub Actions workflow at `.github/workflows/deploy.yml`.

1. In your GitHub repository, go to **Settings** > **Pages**.
2. Under **Build and deployment**, set the **Source** to **GitHub Actions**.
3. Push changes to the `main` branch:
   ```bash
   git push origin main
   ```
4. The workflow will automatically install dependencies, build the application with the configured base path (`/AlgoVis/`), and deploy it to `https://<username>.github.io/AlgoVis/`.

---

## 📁 Project Structure

```text
AlgoVis/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages CI/CD pipeline
├── public/                     # Static assets
├── src/
│   ├── components/             # Interactive visualizer components
│   │   ├── Introduction.tsx             # ADTs & foundation
│   │   ├── GrowthVisualizer.tsx         # Big O / Asymptotic complexity
│   │   ├── GraphVisualizer.tsx          # Graphs, BFS, DFS, matrix/list
│   │   ├── LinkedListVisualizer.tsx     # Singly and Doubly linked lists
│   │   ├── StackVisualizer.tsx          # Stacks & Queues (LIFO / FIFO)
│   │   ├── HashTableVisualizer.tsx      # Hash tables & collision resolution
│   │   ├── BSTVisualizer.tsx            # Binary Search Trees & traversals
│   │   ├── SetVisualizer.tsx            # Mathematical sets & Venn diagrams
│   │   ├── SortingVisualizer.tsx        # Sorting I (Direct vs Indirect, QuickSort)
│   │   └── AdvancedSortingVisualizer.tsx# Sorting II (Heapsort, Mergesort, Curves)
│   ├── algorithms.ts           # Core algorithm logic & stepping generators
│   ├── App.tsx                 # Main layout, sidebar navigation, view switcher
│   ├── index.css               # Global Tailwind CSS 4 theme imports
│   └── main.tsx                # Application entry point
├── index.html                  # HTML entry template & SEO meta tags
├── package.json                # Project dependencies and npm scripts
├── tsconfig.json               # TypeScript compiler configuration
└── vite.config.ts              # Vite configuration (base: '/AlgoVis/')
```

---

<br />

# 🇪🇸 Documentación en Español

## 📌 Visión General

**AlgoVis** es una plataforma educativa web, moderna, interactiva y responsiva, diseñada para comprender de manera intuitiva y rigurosa las estructuras de datos fundamentales, los paradigmas algorítmicos y el análisis de complejidad asintótica.

El proyecto surge orientado a los contenidos de la cátedra de **Algoritmos y Estructuras de Datos (AED)** de la **FICH - UNL** (Facultad de Ingeniería y Ciencias Hídricas - Universidad Nacional del Litoral, Santa Fe, Argentina), permitiendo unir las demostraciones matemáticas formales con animaciones interactivas paso a paso.

---

## ✨ Módulos y Funcionalidades

### 1. 📖 Introducción y TAD (Tipos Abstractos de Datos)
- Separación formal entre **especificación abstracta** (qué operaciones realiza) e **implementación física** (cómo se almacena en memoria).
- Conceptos de invariantes de representación, encapsulamiento y modularidad.

### 2. 📈 Tasas de Crecimiento y Notación Asintótica
- Curvas interactivas de las clases de complejidad: $\mathcal{O}(1)$, $\mathcal{O}(\log n)$, $\mathcal{O}(n)$, $\mathcal{O}(n \log n)$, $\mathcal{O}(n^2)$, $\mathcal{O}(2^n)$, $\mathcal{O}(n!)$.
- Controles deslizantes de tamaño de entrada ($n$) para comprobar experimentalmente cómo escala el costo computacional frente a cotas superiores ($\mathcal{O}$), inferiores ($\Omega$) y ajustadas ($\Theta$).

### 3. 🕸️ Grafos
- Lienzo visual para modelar grafos dirigidos, no dirigidos y con pesos.
- Comparativa visual en tiempo real entre:
  - **Matriz de Adyacencia** (acceso en $\mathcal{O}(1)$, espacio $\mathcal{O}(V^2)$).
  - **Listas de Adyacencia** (espacio óptimo $\mathcal{O}(V + E)$).
- Algoritmos de recorrido animados paso a paso:
  - **BFS** (Búsqueda en Anchura / Breadth-First Search) con visualización de la cola de frontera y niveles.
  - **DFS** (Búsqueda en Profundidad / Depth-First Search) con pila de recursión y descubrimiento.

### 4. 🔗 Listas Enlazadas
- Representación gráfica de nodos y punteros para **Listas Simplemente Enlazadas** y **Listas Doblemente Enlazadas**.
- Operaciones interactivas: inserción en cabeza, cola o posición intermedia, borrado de elementos y reconfiguración de punteros (`next` y `prev`).
- Explicación de la penalidad de acceso secuencial ($\mathcal{O}(n)$) frente a la memoria contigua de arreglos ($\mathcal{O}(1)$).

### 5. 🥞 Pilas y Colas
- **Pila / Stack (LIFO - Last In, First Out)**: operaciones `push`, `pop`, `peek`, detección de desbordamiento (overflow) y subdesbordamiento (underflow).
- **Cola / Queue (FIFO - First In, First Out)**: operaciones `enqueue`, `dequeue`, implementación sobre búfer circular y sobre nodos dinámicos.
- Casos de aplicación práctica (pila de llamadas del sistema, gestión de tareas en búfer).

### 6. #️⃣ Correspondencias y Tablas Hash (Hash Tables)
- Transformación de claves mediante funciones de dispersión (hash) a ranuras de un arreglo.
- Visualización de resolución de colisiones:
  - **Encadenamiento Separado** (Separate Chaining): listas enlazadas en cada ranura.
  - **Direccionamiento Abierto** (Open Addressing): sondeo lineal (Linear Probing).
- Cálculo en tiempo real del factor de carga ($\alpha = n/m$) y análisis de degradación de rendimiento.

### 7. 🌳 Árboles Binarios de Búsqueda (BST)
- Diagramación automática del árbol respetando la propiedad de orden ($h_{izq} < raíz \le h_{der}$).
- Operaciones animadas: inserción, búsqueda y eliminación (casos: nodo hoja, 1 hijo o 2 hijos mediante sucesor en in-orden).
- Recorridos clásicos con trazado del camino: **In-Orden** (produce secuencia ordenada), **Pre-Orden** y **Post-Orden**.

### 8. 🔄 Conjuntos (Sets)
- Visualización matemática de operaciones de conjuntos sobre diagramas de Venn interactivos.
- Operaciones de Unión ($A \cup B$), Intersección ($A \cap B$), Diferencia ($A \setminus B$) y verificación de pertenencia.

### 9. 📊 Ordenamiento I (Algoritmos Elementales)
- Animaciones comparativas sobre barras con velocidad ajustable:
  - **Burbuja (Bubble Sort)**
  - **Selección (Selection Sort)**
  - **Inserción (Insertion Sort)**
  - **Quicksort** (partición de Hoare/Lomuto y pivoteo)
- **Ordenamiento Directo vs. Indirecto**: Explicación teórica y práctica de la ordenación mediante un arreglo auxiliar de índices (`indx`) para evitar el costo de mover objetos pesados en memoria principal.

### 10. ⚡ Ordenamiento II (Algoritmos Avanzados y Comparación Empírica)
- **Heapsort**: Animación visual que conecta el arreglo plano con su interpretación conceptual de montículo binario (*heap*):
  1. *Fase 1: Construcción del Max-Heap* en tiempo $\mathcal{O}(n)$.
  2. *Fase 2: Extracción sucesiva y tamizado hacia abajo (sift-down)* en tiempo $\mathcal{O}(n \log n)$.
- **Mergesort**: Animación del paradigma "Divide y Vencerás", mostrando la división recursiva y el intercalamiento ordenado en memoria auxiliar.
- **Gráfica Comparativa Asintótica Empírica**:
  - Representación de la relación normalizada $T(n)/n$ frente a $n$ en escala doblemente logarítmica.
  - Estudio de curvas reales comparando `STL[vec]`, `heap-sort`, `merge-sort[vec]`, `quick-sort`, `libc-sort` y `merge-sort[list]`, resaltando el impacto de la localidad espacial de caché y la sobrecarga de punteros en listas.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**: [React 19](https://react.dev/) con arquitectura modular basada en componentes funcionales y Hooks.
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/) para tipado estático riguroso de algoritmos y estructuras.
- **Empaquetador**: [Vite 6](https://vitejs.dev/) con compilación ultrarrápida.
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/) para una interfaz oscura pulida, limpia y accesible.
- **Animaciones**: [Motion](https://motion.dev/) para transiciones fluidas de elementos en estructuras de datos.
- **Gráficos**: [Recharts](https://recharts.org/) para el renderizado de curvas asintóticas y de complejidad.
- **Iconografía**: [Lucide React](https://lucide.dev/).
- **Entorno de ejecución / Gestor**: [Bun](https://bun.sh/) y [Node.js](https://nodejs.org/).
- **CI/CD**: [GitHub Actions](https://github.com/features/actions) desplegando automáticamente en [GitHub Pages](https://pages.github.com/).

---

## 💻 Instalación y Uso Local

### Requisitos previos
Tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior) o [Bun](https://bun.sh/).

### 1. Clonar el repositorio
```bash
git clone https://github.com/rodrigoarriondo/AlgoVis.git
cd AlgoVis
```

### 2. Instalar dependencias

Con **Bun** (recomendado):
```bash
bun install
```

Con **npm**:
```bash
npm install
```

### 3. Iniciar el servidor de desarrollo
```bash
# Con Bun
bun run dev

# Con npm
npm run dev
```
Accede desde tu navegador a [http://localhost:3000](http://localhost:3000).

### 4. Compilar para producción
```bash
# Con Bun
bun run build

# Con npm
npm run build
```
Los archivos optimizados para producción se generarán en la carpeta `dist/`.

---

## 🚀 Despliegue en GitHub Pages

El proyecto ya cuenta con el flujo automatizado en `.github/workflows/deploy.yml`:

1. En tu repositorio de GitHub, dirígete a **Settings** > **Pages**.
2. En **Build and deployment**, selecciona como fuente (**Source**) la opción **GitHub Actions**.
3. Al hacer push a la rama `main`, la acción compilará el código y lo publicará automáticamente en:
   `https://<tu-usuario>.github.io/AlgoVis/`

*(Nota: La ruta base está configurada en `vite.config.ts` como `base: '/AlgoVis/'` para ser compatible con GitHub Pages).*

---

## 🎓 Contexto Académico

Este proyecto fue desarrollado como complemento interactivo y pedagógico para el estudio de **Algoritmos y Estructuras de Datos**, facilitando la comprensión visual de los conceptos teóricos abordados en las carreras de ingeniería de la **FICH - UNL** (Facultad de Ingeniería y Ciencias Hídricas, Universidad Nacional del Litoral, Santa Fe, Argentina).

---

## 🤝 Contribuciones

¡Las contribuciones, sugerencias y mejoras son bienvenidas!
Si deseas colaborar:

1. Haz un Fork del proyecto.
2. Crea una rama para tu feature (`git checkout -b feature/nueva-visualizacion`).
3. Realiza tus cambios y haz commit (`git commit -m 'feat: agregar nuevo algoritmo de ordenamiento'`).
4. Sube la rama (`git push origin feature/nueva-visualizacion`).
5. Abre un **Pull Request**.

---

## 📄 Licencia

Este proyecto se encuentra bajo la licencia **MIT**. Consulta el archivo `LICENSE` para más detalles.

---

<p align="center">
  Hecho con ❤️ para la enseñanza y el aprendizaje de la ciencia de la computación.
</p>

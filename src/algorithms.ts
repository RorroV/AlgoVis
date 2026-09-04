export type Action =
  | { type: 'compare'; indices: [number, number]; lines?: number[] }
  | { type: 'swap'; indices: [number, number]; lines?: number[] }
  | { type: 'overwrite'; index: number; value: number; lines?: number[] }
  | { type: 'mark_sorted'; index: number; lines?: number[] };

export const bubbleSort = (arr: number[]): Action[] => {
  const actions: Action[] = [];
  const tempArr = [...arr];
  const n = tempArr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      actions.push({ type: 'compare', indices: [j, j + 1], lines: [4] });
      if (tempArr[j] > tempArr[j + 1]) {
        actions.push({ type: 'swap', indices: [j, j + 1], lines: [5] });
        const temp = tempArr[j];
        tempArr[j] = tempArr[j + 1];
        tempArr[j + 1] = temp;
      }
    }
    actions.push({ type: 'mark_sorted', index: n - i - 1, lines: [2] });
  }
  return actions;
};

export const selectionSort = (arr: number[]): Action[] => {
  const actions: Action[] = [];
  const tempArr = [...arr];
  const n = tempArr.length;
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      actions.push({ type: 'compare', indices: [minIdx, j], lines: [5] });
      if (tempArr[j] < tempArr[minIdx]) {
        minIdx = j;
        actions.push({ type: 'compare', indices: [minIdx, j], lines: [6] });
      }
    }
    if (minIdx !== i) {
      actions.push({ type: 'swap', indices: [i, minIdx], lines: [9] });
      const temp = tempArr[i];
      tempArr[i] = tempArr[minIdx];
      tempArr[minIdx] = temp;
    }
    actions.push({ type: 'mark_sorted', index: i, lines: [2] });
  }
  return actions;
};

export const insertionSort = (arr: number[]): Action[] => {
  const actions: Action[] = [];
  const tempArr = [...arr];
  const n = tempArr.length;
  for (let i = 1; i < n; i++) {
    let key = tempArr[i];
    let j = i - 1;
    actions.push({ type: 'compare', indices: [j, i], lines: [5] });
    while (j >= 0 && tempArr[j] > key) {
      actions.push({ type: 'compare', indices: [j, j + 1], lines: [5] });
      actions.push({ type: 'overwrite', index: j + 1, value: tempArr[j], lines: [6] });
      tempArr[j + 1] = tempArr[j];
      j = j - 1;
    }
    actions.push({ type: 'overwrite', index: j + 1, value: key, lines: [9] });
    tempArr[j + 1] = key;
  }
  for (let i = 0; i < n; i++) {
    actions.push({ type: 'mark_sorted', index: i, lines: [10] });
  }
  return actions;
};

export const quickSort = (arr: number[]): Action[] => {
  const actions: Action[] = [];
  const tempArr = [...arr];

  const partition = (low: number, high: number): number => {
    let pivot = tempArr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      actions.push({ type: 'compare', indices: [j, high], lines: [4] });
      if (tempArr[j] < pivot) {
        i++;
        actions.push({ type: 'swap', indices: [i, j], lines: [5, 6] });
        let temp = tempArr[i];
        tempArr[i] = tempArr[j];
        tempArr[j] = temp;
      }
    }
    actions.push({ type: 'swap', indices: [i + 1, high], lines: [9] });
    let temp = tempArr[i + 1];
    tempArr[i + 1] = tempArr[high];
    tempArr[high] = temp;
    return i + 1;
  };

  const quickSortHelper = (low: number, high: number) => {
    if (low < high) {
      let pi = partition(low, high);
      actions.push({ type: 'mark_sorted', index: pi, lines: [15] });
      quickSortHelper(low, pi - 1);
      quickSortHelper(pi + 1, high);
    } else if (low === high) {
      actions.push({ type: 'mark_sorted', index: low, lines: [14] });
    }
  };

  quickSortHelper(0, tempArr.length - 1);
  return actions;
};

export const algorithmsData: Record<string, {
  name: string;
  description: string;
  timeComplexity: { best: string; average: string; worst: string };
  spaceComplexity: string;
  run: (arr: number[]) => Action[];
}> = {
  bubble: {
    name: "Bubble Sort",
    description: "Algoritmo sencillo que intercambia repetidamente elementos adyacentes si están en el orden incorrecto. Flota los elementos más grandes hacia el final de la lista.",
    timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)",
    run: bubbleSort,
  },
  selection: {
    name: "Selection Sort",
    description: "Ordena una matriz encontrando iterativamente el elemento mínimo de la parte no ordenada y colocándolo al principio.",
    timeComplexity: { best: "O(n²)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)",
    run: selectionSort,
  },
  insertion: {
    name: "Insertion Sort",
    description: "Construye la matriz ordenada final un elemento a la vez. Toma cada elemento y lo inserta en su posición correcta dentro de la parte ya ordenada.",
    timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)",
    run: insertionSort,
  },
  quick: {
    name: "Quick Sort",
    description: "Algoritmo de divide y vencerás. Elige un 'pivote' y divide la matriz de manera que los menores queden a la izquierda y los mayores a la derecha.",
    timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n²)" },
    spaceComplexity: "O(log n)",
    run: quickSort,
  },
};

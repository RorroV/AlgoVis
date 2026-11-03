import React, { useState } from 'react';
import { Layers, BarChart2, FolderTree, Info, Activity, Share2, Link as LinkIcon, Hash, Menu, TrendingUp, BookOpen, Combine } from 'lucide-react';
import Introduction from './components/Introduction';
import SortingVisualizer from './components/SortingVisualizer';
import AdvancedSortingVisualizer from './components/AdvancedSortingVisualizer';
import StackVisualizer from './components/StackVisualizer';
import BSTVisualizer from './components/BSTVisualizer';
import GraphVisualizer from './components/GraphVisualizer';
import LinkedListVisualizer from './components/LinkedListVisualizer';
import HashTableVisualizer from './components/HashTableVisualizer';
import SetVisualizer from './components/SetVisualizer';
import GrowthVisualizer from './components/GrowthVisualizer';

export default function App() {
  const [activeTab, setActiveTab] = useState<'intro' | 'sorting' | 'sorting2' | 'stack' | 'bst' | 'graph' | 'linkedlist' | 'hashtable' | 'growth' | 'sets'>('intro');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  React.useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };
    checkScreenSize();
  }, []);

  const NavButton = ({ id, icon: Icon, label }: { id: any, icon: any, label: string }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        if (window.innerWidth < 768) {
          setIsSidebarOpen(false);
        }
      }}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        activeTab === id 
          ? 'bg-indigo-500/10 text-indigo-400' 
          : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className="truncate">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col md:flex-row overflow-hidden">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:sticky top-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen shrink-0 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:hidden'
        }`}
      >
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-indigo-500 shrink-0" />
              <span className="truncate">AlgoVis Educativo</span>
            </h1>
            <p className="text-xs text-slate-400 mt-2 truncate">Algoritmos y Estructuras de Datos</p>
          </div>
        </div>
        
        <nav className="p-4 flex-1 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-2 px-2">
            Temario
          </div>
          
          <NavButton id="intro" icon={BookOpen} label="Introducción y TAD" />
          <NavButton id="growth" icon={TrendingUp} label="Tasas de Crecimiento" />
          <NavButton id="graph" icon={Share2} label="Grafos" />
          <NavButton id="linkedlist" icon={LinkIcon} label="Listas" />
          <NavButton id="stack" icon={Layers} label="Pilas y Colas" />
          <NavButton id="hashtable" icon={Hash} label="Correspondencias" />
          <NavButton id="bst" icon={FolderTree} label="Árboles" />
          <NavButton id="sets" icon={Combine} label="Conjuntos" />
          <NavButton id="sorting" icon={BarChart2} label="Ordenamiento I" />
          <NavButton id="sorting2" icon={BarChart2} label="Ordenamiento II" />
        </nav>
        
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
          <p className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 shrink-0" /> AED 2026
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col h-screen relative">
        <header className="bg-slate-900/80 border-b border-slate-800 p-4 shrink-0 flex items-center gap-4 sticky top-0 z-10 backdrop-blur-sm">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Alternar Menú"
          >
            <Menu className="w-5 h-5 shrink-0" />
          </button>
          <div className="font-semibold text-slate-200 truncate">
            {activeTab === 'intro' && 'Introducción y TAD'}
            {activeTab === 'growth' && 'Tasas de Crecimiento'}
            {activeTab === 'sorting' && 'Ordenamiento I'}
            {activeTab === 'sorting2' && 'Ordenamiento II'}
            {activeTab === 'stack' && 'Pilas y Colas'}
            {activeTab === 'bst' && 'Árboles'}
            {activeTab === 'sets' && 'Conjuntos'}
            {activeTab === 'graph' && 'Grafos y Coloración'}
            {activeTab === 'linkedlist' && 'Listas Enlazadas'}
            {activeTab === 'hashtable' && 'Correspondencias'}
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'intro' && <Introduction />}
          {activeTab === 'growth' && <GrowthVisualizer />}
          {activeTab === 'sorting' && <SortingVisualizer />}
          {activeTab === 'sorting2' && <AdvancedSortingVisualizer />}
          {activeTab === 'stack' && <StackVisualizer />}
          {activeTab === 'bst' && <BSTVisualizer />}
          {activeTab === 'sets' && <SetVisualizer />}
          {activeTab === 'graph' && <GraphVisualizer />}
          {activeTab === 'linkedlist' && <LinkedListVisualizer />}
          {activeTab === 'hashtable' && <HashTableVisualizer />}
        </div>
      </main>
    </div>
  );
}

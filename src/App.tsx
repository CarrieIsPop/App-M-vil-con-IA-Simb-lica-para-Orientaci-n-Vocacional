import { useState } from 'react';
import { arbolVocacional, isDecisionNode } from './vocationalTree';
import { DecisionNode, CareerInfo, DecisionHistoryItem } from './types';
import Header from './components/Header';
import WelcomeStage from './components/WelcomeStage';
import QuestionStage from './components/QuestionStage';
import ResultStage from './components/ResultStage';
import { Sparkles, Brain, Smartphone, Landmark, Heart, Layers, Activity, ActivityIcon, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentStage, setCurrentStage] = useState<'welcome' | 'test' | 'result'>('welcome');
  const [currentNode, setCurrentNode] = useState<DecisionNode>(arbolVocacional);
  const [history, setHistory] = useState<DecisionHistoryItem[]>([]);
  
  // Audio configuration states
  const [speakEnabled, setSpeakEnabled] = useState<boolean>(true);
  const [voiceRespondEnabled, setVoiceRespondEnabled] = useState<boolean>(false);

  // Starts the test cycle
  const handleStartTest = () => {
    setCurrentNode(arbolVocacional);
    setHistory([]);
    setCurrentStage('test');
  };

  // Navigates down the binary tree based on affirmative/negative dicotomic answer
  const handleAnswerQuestion = (response: boolean) => {
    const nextPath = response ? currentNode.si : currentNode.no;
    
    // Register step item to visual history roadmap
    const nextName = isDecisionNode(nextPath) ? nextPath.pregunta : (nextPath as CareerInfo).carrera;
    const historyItem: DecisionHistoryItem = {
      id: currentNode.id,
      pregunta: currentNode.pregunta,
      respuesta: response,
      siguiente: nextName
    };

    const nextHistory = [...history, historyItem];
    setHistory(nextHistory);

    if (isDecisionNode(nextPath)) {
      setCurrentNode(nextPath);
    } else {
      // Leaf node, transition to result card
      setCurrentStage('result');
      // Store the final career inside our state node wrapper
      setCurrentNode(nextPath as any);
    }
  };

  // Traverses back one step by rebuilding tree position from root path logs
  const handleBack = () => {
    if (history.length === 0) return;

    // Speech stop synthesis
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    const nextHistory = [...history];
    nextHistory.pop(); // pop last decision

    // Reconstruct position from root
    let tempNode = arbolVocacional;
    for (const step of nextHistory) {
      tempNode = step.respuesta ? (tempNode.si as DecisionNode) : (tempNode.no as DecisionNode);
    }

    setHistory(nextHistory);
    setCurrentNode(tempNode);
    setCurrentStage('test');
  };

  // Resets test structures completely
  const handleRestart = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setCurrentStage('welcome');
    setHistory([]);
    setCurrentNode(arbolVocacional);
  };

  // Dynamically calculated symbolic AI statistics for the sidebar
  const currentLevel = history.length + 1;
  const maxLevels = 4;
  
  // Entropy reduces as decision narrows down. Starting at 1.0 down to near 0.
  const currentEntropy = Math.max(1.0 - (history.length * 0.28), 0.12).toFixed(2);
  
  // Matching confidence level probability increases with node depth
  const cumulativeProbability = Math.min(50 + (history.length * 15), 98);

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans text-slate-900 flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-950" id="vocatio-app-root">
      
      {/* Universal Sticky Header */}
      <Header onRestart={handleRestart} currentStage={currentStage} />

      {/* Main Split-Screen Layout (Sidebar Glow + Dot Pattern Workspace) */}
      <div className="flex-grow flex flex-col lg:flex-row max-w-7xl mx-auto w-full border-x border-b border-slate-200 bg-white">
        
        {/* Left Sidebar Info/Status column */}
        <section className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-slate-200 p-6 sm:p-10 md:p-12 sidebar-glow flex flex-col justify-between select-none">
          <div className="space-y-8">
            {/* Meta Tags */}
            <div className="space-y-3">
              <span className="text-indigo-600 text-[10.5px] font-bold uppercase tracking-wider block">
                🧠 IA Simbólica & Árboles de Decisión
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
                Tu futuro académico diseñado por lógica recursiva.
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Utilizamos algoritmos de recorrido dicotómico puro para correlacionar con precisión tus preferencias frente a perfiles profesionales reales, eliminando las ambigüedades de los tests impresos.
              </p>
            </div>

            {/* Tree State Statistics Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 card-shadow space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Estado del Motor Vocacional
                </span>
              </div>

              <div className="space-y-2.5 pt-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Fase de Aplicación</span>
                  <span className="font-mono text-indigo-600 font-bold uppercase">
                    {currentStage === 'welcome' ? 'Inducción' : currentStage === 'test' ? 'Perfilamiento' : 'Conclusión'}
                  </span>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Nivel del Árbol</span>
                  <span className="font-mono text-slate-800 font-semibold">
                    {currentStage === 'welcome' ? '00' : `0${currentLevel}`} / 04
                  </span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium" title="Un valor bajo indica mayor seguridad y certidumbre en las recomendaciones">
                    Entropía de Selección
                  </span>
                  <span className="font-mono text-slate-400" title="Información residual del perfil">
                    {currentStage === 'welcome' ? '1.00' : currentEntropy} bits
                  </span>
                </div>

                <div className="flex justify-between text-xs font-semibold border-t border-slate-100 pt-2.5 mt-2">
                  <span className="text-slate-900 font-medium">Ajuste de Afinación acumulado</span>
                  <span className="text-emerald-600 font-mono">
                    {currentStage === 'welcome' ? '50%' : `${cumulativeProbability}%`}
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Nodes Trace Breadcrumbs */}
            {history.length > 0 && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/50 space-y-3">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Camino de Nodos Tomados
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {history.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <div 
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-mono font-bold ${
                          idx === history.length - 1 
                            ? 'bg-indigo-600 text-white shadow-sm ring-4 ring-indigo-50' 
                            : 'bg-indigo-100 text-indigo-700'
                        }`}
                        title={step.pregunta}
                      >
                        {idx + 1}
                      </div>
                      {idx < history.length - 1 && (
                        <span className="text-slate-300 font-mono">→</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Slogan footnote */}
          <div className="text-[10px] text-slate-400 mt-8 hidden lg:block font-mono tracking-tight">
            <span>Vocatio IA • Árbol de Regresión v1.2</span>
          </div>
        </section>

        {/* Right Workspace interactive column */}
        <section className="flex-1 bg-white flex flex-col items-center justify-center p-6 sm:p-12 md:p-16 relative">
          
          {/* Subtle design dot background pattern helper */}
          <div className="absolute inset-0 pattern-dots opacity-[0.025] pointer-events-none" />

          {/* Stage Core Wrapper */}
          <div className="w-full max-w-xl relative z-10 transition-all">
            {currentStage === 'welcome' && (
              <WelcomeStage
                onStart={handleStartTest}
                speakEnabled={speakEnabled}
                setSpeakEnabled={setSpeakEnabled}
                voiceRespondEnabled={voiceRespondEnabled}
                setVoiceRespondEnabled={setVoiceRespondEnabled}
              />
            )}

            {currentStage === 'test' && (
              <QuestionStage
                currentNode={currentNode}
                onAnswer={handleAnswerQuestion}
                onBack={handleBack}
                historyLength={history.length}
                speakEnabled={speakEnabled}
                voiceRespondEnabled={voiceRespondEnabled}
              />
            )}

            {currentStage === 'result' && (
              <ResultStage
                career={currentNode as any as CareerInfo}
                history={history}
                onRestart={handleRestart}
                speakEnabled={speakEnabled}
              />
            )}
          </div>
        </section>

      </div>

      {/* Modern, Aesthetic Footnotes and System Attributes */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-[10.5px] text-slate-400 font-sans mt-auto">
        <div className="max-w-6xl mx-auto px-4 space-y-2.5">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 font-mono text-[10px]">
            <span className="flex items-center gap-1 text-slate-500 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              IA Simbólica Integrada
            </span>
            <span className="hidden sm:inline text-slate-200">|</span>
            <span className="flex items-center gap-1 text-slate-500 font-semibold">
              <Brain className="w-3.5 h-3.5 text-violet-500" />
              Procesamiento de Voz Webkit
            </span>
            <span className="hidden sm:inline text-slate-200">|</span>
            <span className="flex items-center gap-1 text-slate-500 font-semibold">
              <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
              Soporte APK Directo
            </span>
          </div>
          
          <p className="max-w-md mx-auto leading-normal text-slate-400/80">
            Vocatio es una plataforma académica de orientación vocacional asistida. Todas las sugerencias de carreras se calculan determinísticamente basándose en teorías cognitivas y el algoritmo recursivo de IA Simbólica.
          </p>

          <p className="pt-2 text-[9.5px] uppercase tracking-widest text-indigo-500 font-bold flex items-center justify-center gap-1 select-none">
            Hecho con {''}
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 animate-pulse inline-block" /> {''}
            por Estudiantes de Vocatio © 2026
          </p>
        </div>
      </footer>
    </div>
  );
}


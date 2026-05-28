import { useEffect, useState } from 'react';
import { CareerInfo, DecisionHistoryItem } from '../types';
import * as Icons from 'lucide-react';
import AICounselor from './AICounselor';
import { Undo2, CheckCircle2, Bookmark, Flame, MapPin, BadgeDollarSign, Clock, HelpCircle } from 'lucide-react';

interface ResultStageProps {
  career: CareerInfo;
  history: DecisionHistoryItem[];
  onRestart: () => void;
  speakEnabled: boolean;
}

export default function ResultStage({
  career,
  history,
  onRestart,
  speakEnabled
}: ResultStageProps) {
  const [showAICounselor, setShowAICounselor] = useState(false);

  // Dynamically resolve Icon from Lucide exports
  const IconComponent = (Icons as any)[career.icono] || Icons.Award;

  // 🔊 Speak career achievement summary
  useEffect(() => {
    if (speakEnabled && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const textIntro = `¡Felicitaciones! Tu carrera ideal recomendada es: ${career.carrera}. ${career.desc}`;
      const utterance = new SpeechSynthesisUtterance(textIntro);
      utterance.lang = 'es-ES';
      window.speechSynthesis.speak(utterance);
    }
  }, [career, speakEnabled]);

  return (
    <div className="max-w-xl mx-auto py-2 px-2" id="results-stage-view">
      {/* Visual Success Confetti/Ribbon Banner */}
      <div className="text-center mb-6">
        <span className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold mb-3 tracking-wide">
          ✓ PERFILAMIENTO RECURSIVO EXITOSO
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          ¡Tu Vocación ha Sido Revelada!
        </h2>
      </div>

      {/* Main Career Result Card */}
      <div className="bg-white rounded-3xl border border-slate-200/60 p-6 sm:p-8 space-y-6 relative overflow-hidden card-shadow">
        
        {/* Career Core Identification */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-150">
            <IconComponent className="w-8 h-8 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#6366f1] bg-indigo-50 px-2.0 py-0.5 rounded-full font-bold uppercase">
              Carrera Sugerida
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 leading-tight mt-1">
              {career.carrera}
            </h3>
          </div>
        </div>

        {/* Description Body */}
        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
          {career.desc}
        </p>

        {/* Essential Career Stats */}
        <div className="grid grid-cols-2 gap-3.5 pt-2">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <BadgeDollarSign className="w-4 h-4 text-emerald-500" />
              <span>Salario Inicial Promedio</span>
            </div>
            <p className="text-xs font-extrabold text-slate-800 mt-1 font-mono">
              {career.salarioPromedio}
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>Duración Estimada</span>
            </div>
            <p className="text-xs font-extrabold text-slate-800 mt-1 font-mono">
              {career.duracion}
            </p>
          </div>
        </div>

        {/* Required Competencies / Skills Panel */}
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <Bookmark className="w-4 h-4 text-indigo-500" />
            Habilidades Clave Asociadas
          </h4>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {career.habilidadesClave.map((skill, index) => (
              <span 
                key={index} 
                className="text-[10.5px] font-semibold tracking-tight px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100/30"
              >
                ✦ {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Real Job Market Locations / Areas */}
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-500" />
            Salidás Laborales e Inserción
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {career.campoLaboral.map((job, index) => (
              <li 
                key={index} 
                className="text-[11px] text-slate-600 flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-tight"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{job}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Decision Roadmap Path Card (The flowchart trace) */}
      <div className="bg-white rounded-3xl border border-slate-200/60 p-6 sm:p-8 mt-6 space-y-4 card-shadow">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
          🗺️ Historial de Decisiones (Ruta Inferencia)
        </h3>
        
        <div className="relative border-l-2 border-slate-100 pl-4 ml-2.5 space-y-5">
          {history.map((step, index) => (
            <div key={index} className="relative">
              {/* Dot icon indicator */}
              <div className={`absolute -left-[24.5px] top-1 w-3 h-3 rounded-full border-2 border-white ${step.respuesta ? 'bg-emerald-500' : 'bg-rose-400'}`} />
              
              <div className="space-y-1">
                <p className="text-[11px] text-slate-400 font-mono font-semibold uppercase">
                  Paso {index + 1}:
                </p>
                <h4 className="text-[11.5px] font-bold text-slate-800 leading-snug">
                  {step.pregunta}
                </h4>
                <div className="flex items-center gap-1.5 text-[10.5px]">
                  <span className={`font-extrabold px-1.5 py-0.5 rounded text-[9.5px] uppercase ${step.respuesta ? 'bg-emerald-50 text-emerald-700 font-bold' : 'bg-rose-50 text-rose-600 font-bold'}`}>
                    {step.respuesta ? 'Sí' : 'No'}
                  </span>
                  <span className="text-slate-300">→</span>
                  <span className="text-slate-500 italic font-mono truncate max-w-sm">
                    {step.siguiente}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Conversational Counselor (Proxy of Gemini API) */}
      <div className="mt-6 space-y-3">
        {!showAICounselor ? (
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-4 shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase bg-white/10 px-2 py-0.5 rounded-full font-bold text-indigo-300">
                MÓDULO DE SERVIDOR GEMINI
              </span>
              <h3 className="text-xl font-bold">
                ¿Tienes dudas? Conversa con el Consejero de IA
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Nuestra IA en el servidor (Gemini) responderá en tiempo real tus inquietudes sobre la carrera de {career.carrera}, incluyendo salidas laborales, dificultad y materias de estudio.
              </p>
            </div>
            
            <button
              onClick={() => setShowAICounselor(true)}
              className="py-2.5 px-4 rounded-full bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              id="enable-ai-counselor-action"
            >
              <Icons.MessageSquare className="w-4 h-4 text-indigo-600" />
              <span>Chatear con Orientador IA (Gemini)</span>
            </button>
          </div>
        ) : (
          <AICounselor careerName={career.carrera} history={history} />
        )}
      </div>

      {/* Restart/Reset Action bottom */}
      <div className="pt-6">
        <button
          onClick={onRestart}
          className="w-full py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer shadow-sm"
          id="restart-test-action"
        >
          <Undo2 className="w-4 h-4 text-indigo-400" />
          <span>Reiniciar Test y Probar Otras Alternativas</span>
        </button>
      </div>
    </div>
  );
}

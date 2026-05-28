import { useEffect, useRef, useState } from 'react';
import { DecisionNode } from '../types';
import { Check, X, Undo2, Volume2, Mic, MicOff, Landmark, CornerDownRight } from 'lucide-react';

interface QuestionStageProps {
  currentNode: DecisionNode;
  onAnswer: (response: boolean) => void;
  onBack: () => void;
  historyLength: number;
  speakEnabled: boolean;
  voiceRespondEnabled: boolean;
}

export default function QuestionStage({
  currentNode,
  onAnswer,
  onBack,
  historyLength,
  speakEnabled,
  voiceRespondEnabled
}: QuestionStageProps) {
  const [speechStatus, setSpeechStatus] = useState<'idle' | 'listening' | 'error' | 'unsupported'>('idle');
  const [userSpokeText, setUserSpokeText] = useState<string>('');
  const recognitionRef = useRef<any>(null);

  // 🔊 Text to Speech (TTS) Logic
  useEffect(() => {
    if (speakEnabled && typeof window !== 'undefined' && window.speechSynthesis) {
      // Cancel previous speech to prevent overlapping queues
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(currentNode.pregunta);
      utterance.lang = 'es-ES';
      utterance.rate = 1.0;
      utterance.pitch = 1.1; // Slightly juvenile/friendly pitch
      
      // If there is extra detail, narrate it with a slight pause
      if (currentNode.descripcion) {
        utterance.text = `${currentNode.pregunta} ... Nota: ${currentNode.descripcion}`;
      }

      window.speechSynthesis.speak(utterance);
    }
  }, [currentNode, speakEnabled]);

  // 🎙️ Speech Recognition Logic
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechStatus('unsupported');
      return;
    }

    if (!voiceRespondEnabled) {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      setSpeechStatus('idle');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = true;
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setSpeechStatus('listening');
    };

    recognition.onresult = (event: any) => {
      const resultsLength = event.results.length;
      const transcript = event.results[resultsLength - 1][0].transcript.toLowerCase().trim();
      setUserSpokeText(transcript);

      // Evaluate match affirmative (Sí, claro, acepto, afirmativo)
      if (
        transcript.includes('sí') || 
        transcript.includes('si') || 
        transcript.includes('claro') || 
        transcript.includes('afirmativo') || 
        transcript.includes('correcto') ||
        transcript.includes('chi') 
      ) {
        setSpeechStatus('idle');
        recognition.abort();
        onAnswer(true);
      } 
      // Evaluate match negative (No, negativo, jamas, nunca, rechazar)
      else if (
        transcript.includes('no') || 
        transcript.includes('negativo') || 
        transcript.includes('nunca') || 
        transcript.includes('falso') ||
        transcript.includes('nop')
      ) {
        setSpeechStatus('idle');
        recognition.abort();
        onAnswer(false);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speechrecognition error:', event.error);
      if (event.error !== 'no-speech') {
        setSpeechStatus('error');
      }
    };

    recognition.onend = () => {
      // Automatic re-listen loop if still on this step and enabled
      if (voiceRespondEnabled && speechStatus === 'listening' && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          // Ignore state collision
        }
      }
    };

    try {
      recognition.start();
    } catch (e) {
      console.warn('Error starting speech synthesis:', e);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      }
    };
  }, [currentNode, voiceRespondEnabled]);

  // Estimate progress based on a typical max level of decisions
  const currentProgress = Math.min(((historyLength) / 4) * 100, 95);

  return (
    <div className="max-w-xl mx-auto py-2 px-2" id="questions-stage-view">
      
      {/* Mini Breadcrumb info */}
      <div className="text-center mb-6">
        <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold mb-3 tracking-wide">
          PREGUNTA DE PERFILAMIENTO
        </div>
        
        {/* Central Question Statement */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
          {currentNode.pregunta}
        </h2>
      </div>

      {/* Helper contextual description of the node */}
      {currentNode.descripcion && (
        <p className="text-xs text-slate-500 bg-slate-50 p-4 rounded-2xl border border-slate-150 leading-relaxed mb-6">
          💡 <strong>Descripción Académica:</strong> {currentNode.descripcion}
        </p>
      )}

      {/* Dynamic Speech Assistant Panel */}
      {voiceRespondEnabled && (
        <div className="mb-6 p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 flex flex-col gap-1.5 items-center justify-center text-center">
          {speechStatus === 'listening' ? (
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-duration-1000"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <span className="text-xs font-bold text-indigo-800 font-mono">Micrófono encendido, responde diciendo &quot;SÍ&quot; o &quot;NO&quot;...</span>
            </div>
          ) : speechStatus === 'error' ? (
            <span className="text-xs text-amber-600 font-semibold">⚠️ No logramos escucharte. Puedes hacer clic en los botones.</span>
          ) : speechStatus === 'unsupported' ? (
            <span className="text-xs text-slate-400 font-semibold">Mecanismo de voz no soportado por este navegador.</span>
          ) : null}

          {userSpokeText && (
            <p className="text-[11px] font-mono text-indigo-700">
              Captado en vivo: &quot;{userSpokeText}&quot;
            </p>
          )}
        </div>
      )}

      {/* Binary Choice Buttons Grid - Pure Clean Minimalism Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mb-8">
        {/* YES Button */}
        <button
          onClick={() => onAnswer(true)}
          className="group relative bg-white border-2 border-slate-100 hover:border-indigo-600 p-6 sm:p-8 rounded-3xl transition-all hover:shadow-xl hover:-translate-y-1 text-left cursor-pointer"
          id="dicotomic-yes"
        >
          <div className="w-14 h-14 bg-emerald-50 group-hover:bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 transition-colors shadow-sm">
            <Check className="w-7 h-7 text-emerald-600 group-hover:text-white stroke-[3] transition-colors" />
          </div>
          <span className="block text-xl font-extrabold text-slate-900 mb-1">Sí, me motiva</span>
          <span className="text-slate-400 text-xs">Perfil favorable / Avance dicotómico</span>
        </button>

        {/* NO Button */}
        <button
          onClick={() => onAnswer(false)}
          className="group relative bg-white border-2 border-slate-100 hover:border-slate-950 p-6 sm:p-8 rounded-3xl transition-all hover:shadow-xl hover:-translate-y-1 text-left cursor-pointer"
          id="dicotomic-no"
        >
          <div className="w-14 h-14 bg-rose-50 group-hover:bg-rose-600 rounded-2xl flex items-center justify-center mb-6 transition-colors shadow-sm">
            <X className="w-7 h-7 text-rose-600 group-hover:text-white stroke-[3] transition-colors" />
          </div>
          <span className="block text-xl font-extrabold text-slate-900 mb-1">No, realmente</span>
          <span className="text-slate-400 text-xs">Perfil contrario / Avance dicotómico</span>
        </button>
      </div>

      {/* Progress Status Bar (Standard Clean Minimal design snippet) */}
      <div className="w-full">
        <div className="flex justify-between items-end mb-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Progreso del Test</span>
          <span className="text-sm font-bold text-indigo-600">{Math.round(currentProgress)}%</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${currentProgress}%` }}
          />
        </div>
      </div>

      {/* Auxiliary Nav Buttons */}
      {historyLength > 0 && (
        <button
          onClick={onBack}
          className="mt-8 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 py-2.5 px-4 mx-auto rounded-full bg-white border border-slate-200 shadow-sm hover:shadow active:scale-95 transition-all select-none cursor-pointer"
          id="back-action-button"
        >
          <Undo2 className="w-3.5 h-3.5" />
          <span>Volver a la pregunta anterior</span>
        </button>
      )}
    </div>
  );
}

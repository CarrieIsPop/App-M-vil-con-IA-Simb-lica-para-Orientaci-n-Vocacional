import { Play, Sparkles, Brain, Award, Volume2, Mic, Smartphone, MessageSquare } from 'lucide-react';

interface WelcomeStageProps {
  onStart: () => void;
  speakEnabled: boolean;
  setSpeakEnabled: (val: boolean) => void;
  voiceRespondEnabled: boolean;
  setVoiceRespondEnabled: (val: boolean) => void;
}

export default function WelcomeStage({
  onStart,
  speakEnabled,
  speakEnabled: setSpeakEnabledSelected,
  setSpeakEnabled,
  voiceRespondEnabled,
  setVoiceRespondEnabled
}: WelcomeStageProps) {
  
  // Check browser SpeechRecognition support
  const isSpeechSupported = typeof window !== 'undefined' && 
    (!!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition);

  return (
    <div className="max-w-xl mx-auto py-2 px-2" id="welcome-stage-view">
      {/* Immersive Top Illustration Panel */}
      <div className="text-center mb-8 relative">
        <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold mb-4 tracking-wide">
          PREPARANDO PERFIL DE ORIENTACIÓN
        </span>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
          Tu futuro diseñado por <span className="text-indigo-600">algoritmos.</span>
        </h2>
        
        <p className="mt-3 text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Toma decisiones lógicas libres de ambigüedad. Nuestro Árbol de Inferencia Simbólica te perfilará paso a paso hacia tu carrera ideal en menos de 2 minutos.
        </p>
      </div>

      {/* Feature Bento Grid Card */}
      <div className="bg-white rounded-3xl border border-slate-200/60 p-6 sm:p-8 space-y-6 card-shadow">
        
        {/* Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-tight">Sistema Experto</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Árbol de decisiones dicotómico que filtra habilidades y valores.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-tight">Resultados</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Salarios, campo laboral, aptitudes y mapas de decisiones en vivo.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Voice Access Configuration */}
        <div className="border-t border-b border-slate-100 py-5 space-y-4">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Configuración de Accesibilidad (Módulo de Voz)
          </h3>

          <div className="space-y-2.5">
            {/* Audio Synthesis Toggle */}
            <label className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50/50 cursor-pointer transition-colors border border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${speakEnabled ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-800">Lectura en Voz Alta</h4>
                  <p className="text-[10px] text-slate-400">Escucha la narración automatizada de cada nodo vocacional.</p>
                </div>
              </div>
              <input 
                type="checkbox"
                checked={speakEnabled}
                onChange={(e) => setSpeakEnabled(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </label>

            {/* Audio Recognition Toggle */}
            <label className={`flex items-center justify-between p-3.5 rounded-2xl border transition-colors ${isSpeechSupported ? 'hover:bg-slate-50/50 cursor-pointer border-slate-100' : 'opacity-60 cursor-not-allowed border-dashed border-slate-200 bg-slate-50/50'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${voiceRespondEnabled && isSpeechSupported ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    Responder Hablando
                    {!isSpeechSupported && (
                      <span className="text-[9px] bg-amber-50 text-amber-600 font-mono px-1 rounded">No Soportado</span>
                    )}
                  </h4>
                  <p className="text-[10px] text-slate-400">Responde diciendo claramente &quot;Sí&quot;/&quot;No&quot; al micrófono.</p>
                </div>
              </div>
              <input 
                type="checkbox"
                disabled={!isSpeechSupported}
                checked={voiceRespondEnabled && isSpeechSupported}
                onChange={(e) => setVoiceRespondEnabled(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
              />
            </label>
          </div>
        </div>

        {/* Quick Tech Explanation Note */}
        <div className="p-3 bg-indigo-50/30 rounded-xl flex items-center gap-2.5 text-[10.5px] text-indigo-800 leading-normal border border-indigo-100/50">
          <Smartphone className="w-5 h-5 text-indigo-500 shrink-0" />
          <span>
            <strong>Descarga Móvil:</strong> Para usar la aplicación en tu celular sin conexión, haz clic en <strong>Descargar APK</strong> de la barra superior.
          </span>
        </div>

        {/* Primary Action Trigger */}
        <button
          onClick={onStart}
          className="w-full py-3.5 rounded-full bg-slate-900 text-white hover:bg-slate-850 font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow active:scale-[0.99] group mt-2 cursor-pointer"
          id="start-test-action"
        >
          <span>Comenzar Test Vocacional</span>
          <Play className="w-4 h-4 text-indigo-400 fill-indigo-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}


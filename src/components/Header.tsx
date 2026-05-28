import { Smartphone, Download, Activity, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onRestart: () => void;
  currentStage: 'welcome' | 'test' | 'result';
}

export default function Header({ onRestart, currentStage }: HeaderProps) {
  return (
    <header className="h-20 border-b border-slate-200 bg-white sticky top-0 z-50 transition-all">
      <div className="max-w-6xl mx-auto h-full px-6 sm:px-12 flex items-center justify-between">
        {/* Logo and Name */}
        <div 
          onClick={onRestart}
          className="flex items-center gap-3 cursor-pointer group select-none"
          id="vocatio-logo-container"
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white transition-all group-hover:bg-indigo-700">
            <Activity className="w-5.5 h-5.5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              Vocatio
              <span className="text-[10px] font-mono tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full uppercase font-bold">
                IA Simbólica
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Árbol de Decisión & Orientación Universitaria
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer hidden md:inline" onClick={onRestart}>
            Metodología
          </span>
          <span className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer hidden md:inline" onClick={onRestart}>
            Carreras
          </span>

          {/* APK Direct Download Button */}
          <a
            href="vocatio.apk"
            download="vocatio.apk"
            className="bg-slate-900 text-white px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold hover:bg-slate-800 flex items-center gap-2 transition-all shadow-sm active:scale-95"
            id="download-apk-action"
            title="Descarga directa del empaquetado APK para tu móvil Android"
          >
            <Smartphone className="w-4 h-4 text-indigo-400 group-hover:animate-bounce" />
            <span>Descargar APK</span>
            <Download className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>
      </div>
    </header>
  );
}


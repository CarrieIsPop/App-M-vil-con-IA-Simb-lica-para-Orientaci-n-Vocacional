import React, { useState, useEffect, useRef } from 'react';
import { DecisionHistoryItem } from '../types';
import { Send, Sparkles, Brain, Loader2, RefreshCw, MessageSquare, ArrowRight } from 'lucide-react';

interface AICounselorProps {
  careerName: string;
  history: DecisionHistoryItem[];
}

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export default function AICounselor({ careerName, history }: AICounselorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested conversation starter prompts
  const suggestions = [
    "¿Cuáles son las materias más difíciles de la carrera?",
    "¿Qué opciones de posgrados o especialidades tengo?",
    "¿Cómo puedo empezar a practicar desde el año 1?",
    "¿Cuál es la diferencia con otras profesiones similares?"
  ];

  // Fetch initial automated guidance from the server model on component mount
  const fetchAdvisorWelcome = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          careerName,
          studentAnswers: history,
          chatHistory: []
        })
      });

      if (!response.ok) {
        throw new Error('La respuesta del consejero falló.');
      }

      const data = await response.json();
      setMessages([
        { role: 'assistant', text: data.text }
      ]);
    } catch (e) {
      console.error('Error fetching advisor response:', e);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisorWelcome();
  }, [careerName]);

  // Handle scrolling to bottom whenever new turns are posted
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const nextHistory: ChatMessage[] = [
      ...messages,
      { role: 'user', text: textToSend }
    ];

    setMessages(nextHistory);
    setInputText('');
    setIsLoading(true);
    setHasError(false);

    try {
      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          careerName,
          studentAnswers: history,
          chatHistory: nextHistory
        })
      });

      if (!response.ok) {
        throw new Error('Fallo al obtener respuesta de Gemini.');
      }

      const data = await response.json();
      setMessages([
        ...nextHistory,
        { role: 'assistant', text: data.text }
      ]);
    } catch (e) {
      console.error('Error al enviar mensaje:', e);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // 📝 Bulletproof Custom Markdown Formatter for React-friendly rendering
  const parseMarkdownText = (text: string) => {
    const lines = text.split('\n');
    let insideList = false;
    const renderedElements: React.ReactNode[] = [];

    lines.forEach((line, i) => {
      let cleanLine = line.trim();

      // Heading 3
      if (cleanLine.startsWith('###')) {
        renderedElements.push(
          <h4 key={`h3-${i}`} className="text-sm font-bold text-indigo-950 mt-3.5 mb-1.5 font-sans leading-tight">
            {cleanLine.replace('###', '').trim()}
          </h4>
        );
        insideList = false;
        return;
      }

      // Heading 4
      if (cleanLine.startsWith('####')) {
        renderedElements.push(
          <h5 key={`h4-${i}`} className="text-xs font-extrabold text-gray-900 mt-3 mb-1 font-sans">
            {cleanLine.replace('####', '').trim()}
          </h5>
        );
        insideList = false;
        return;
      }

      // Bullets list items
      if (cleanLine.startsWith('-') || cleanLine.startsWith('*')) {
        renderedElements.push(
          <li key={`li-${i}`} className="text-xs text-gray-700 ml-4 list-disc pl-1.5 mt-0.5 leading-relaxed">
            {parseBolds(cleanLine.substring(1).trim())}
          </li>
        );
        insideList = true;
        return;
      }

      // Spacing or Break
      if (cleanLine === '') {
        renderedElements.push(<div key={`br-${i}`} className="h-2" />);
        insideList = false;
        return;
      }

      // Standard body paragraph
      renderedElements.push(
        <p key={`p-${i}`} className="text-xs text-gray-700 leading-relaxed mt-1">
          {parseBolds(cleanLine)}
        </p>
      );
      insideList = false;
    });

    return renderedElements;
  };

  // Parse inline **bold** occurrences into strong elements
  const parseBolds = (lineText: string) => {
    const parts = lineText.split('**');
    if (parts.length > 2) {
      return parts.map((part, index) => 
        index % 2 === 1 ? <strong key={index} className="font-extrabold text-gray-900">{part}</strong> : part
      );
    }
    return lineText;
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/30 overflow-hidden flex flex-col" id="ai-counselor-container">
      {/* Visual Header bar for the Counselor chat */}
      <div className="bg-indigo-50/40 border-b border-gray-100 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8.5 h-8.5 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-100">
            <Sparkles className="w-4.5 h-4.5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900">IA Consejera Vocacional</h4>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[9px] font-semibold text-gray-400 font-mono uppercase">En línea • Gemini 3.5</span>
            </div>
          </div>
        </div>

        {/* Action to restart advice */}
        <button
          onClick={fetchAdvisorWelcome}
          disabled={isLoading}
          className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all active:scale-90 disabled:opacity-50"
          title="Re-establecer conversación con el Consejero"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Feed Viewport */}
      <div className="p-4 sm:p-5 h-[340px] overflow-y-auto space-y-4 bg-gray-50/50 flex flex-col">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
          >
            {/* Sender tag indicator */}
            <span className="text-[9px] font-mono text-gray-400 mb-1 select-none px-1">
              {msg.role === 'user' ? 'Tú (Estudiante)' : 'Consejero Vocacional IA'}
            </span>

            {/* Bubble wrapper */}
            <div
              className={`p-4 rounded-2xl text-xs space-y-1 ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-100'
                  : 'bg-white text-gray-800 rounded-tl-none border border-gray-100 shadow-sm'
              }`}
            >
              {msg.role === 'user' ? (
                <p className="leading-relaxed font-sans font-semibold">{msg.text}</p>
              ) : (
                parseMarkdownText(msg.text)
              )}
            </div>
          </div>
        ))}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="self-start flex flex-col items-start max-w-[80%]">
            <span className="text-[9px] font-mono text-gray-400 mb-1">Pensando respuesta...</span>
            <div className="p-4 rounded-2xl rounded-tl-none bg-white border border-gray-100 shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
              <span className="text-xs text-gray-500 font-mono">Generando análisis...</span>
            </div>
          </div>
        )}

        {/* Error panel state */}
        {hasError && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-amber-800 text-xs flex flex-col gap-1.5 text-center items-center">
            <span>⚠️ Hubo un error de comunicación con el consultor.</span>
            <button 
              onClick={() => handleSendMessage(inputText || "Hola de nuevo")}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[10.5px] font-bold rounded-lg transition-colors"
            >
              Reintentar enviar
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Shortcut Chips grid */}
      {messages.length > 0 && !isLoading && (
        <div className="px-5 pt-3.5 pb-2 border-t border-gray-100 bg-white">
          <p className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wide mb-2 select-none">
            Preguntas Súper Útiles Recomendadas:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(sug)}
                className="text-[10px] text-indigo-700 bg-indigo-50 hover:bg-indigo-100/70 border border-indigo-100/50 py-1 px-2.5 rounded-full text-left transition-colors font-sans select-none truncate max-w-full"
              >
                {sug} →
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input composition area */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder="Pregúntame sobre el mercado, materias, salarios, etc..."
            className="flex-grow py-3 px-4 text-xs bg-gray-50 hover:bg-gray-100/40 focus:bg-white rounded-xl border border-gray-100 focus:border-indigo-500 focus:outline-none transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="w-11 h-11 shrink-0 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-100 disabled:text-gray-400 text-white rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-md shadow-indigo-100 disabled:shadow-none"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

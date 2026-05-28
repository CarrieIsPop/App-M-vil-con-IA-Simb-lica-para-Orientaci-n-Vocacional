export interface CareerInfo {
  carrera: string;
  desc: string;
  campoLaboral: string[];
  salarioPromedio: string;
  duracion: string;
  habilidadesClave: string[];
  icono: string; // Lucide icon name
  recomendacionesAI?: string; // Cache for Gemini extra feedback
}

export interface DecisionNode {
  id: string;
  pregunta: string;
  descripcion?: string; // extra contextual guide for the question
  si: DecisionNode | CareerInfo;
  no: DecisionNode | CareerInfo;
}

export interface DecisionHistoryItem {
  id: string;
  pregunta: string;
  respuesta: boolean; // true = SI, false = NO
  siguiente: string; // name of chosen path or career
}

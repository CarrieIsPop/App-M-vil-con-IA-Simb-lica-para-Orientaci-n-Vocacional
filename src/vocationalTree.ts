import { DecisionNode, CareerInfo } from './types';

export function isDecisionNode(node: any): node is DecisionNode {
  return node && typeof node === 'object' && 'pregunta' in node && 'id' in node;
}

export const arbolVocacional: DecisionNode = {
  id: "inicio",
  pregunta: "¿Te apasiona la tecnología, la lógica de programación y la resolución de problemas analíticos?",
  descripcion: "Esta pregunta separa las disciplinas técnicas de ingeniería y computación de las de carácter creativo, social y empresarial.",
  si: {
    id: "tecnologia_salud",
    pregunta: "¿Te atraen las ciencias biológicas, de la salud y el estudio del organismo humano?",
    descripcion: "Para decidir si enfocarte en la tecnología pura o en campos biomédicos, psicológicos y médicos.",
    si: {
      id: "investigacion_clinica",
      pregunta: "¿Te gustaría trabajar investigando en laboratorio o diseñando tecnologías biomédicas directas?",
      descripcion: "Diferencia el interés en el diseño de prótesis/fármacos e investigación versus el contacto de diagnóstico con pacientes.",
      si: {
        carrera: "Bioingeniería y Biotecnología",
        desc: "Lidera la revolución científica aplicando ingeniería para resolver problemas en sistemas vivos, diseñando prótesis avanzadas, órganos artificiales y soluciones de manipulación genética para curar enfermedades.",
        campoLaboral: [
          "Centros de desarrollo biotecnológico",
          "Laboratorios farmacéuticos multinacionales",
          "Industria de desarrollo de prótesis de alta tecnología",
          "Centros de bioinformática e ingeniería molecular"
        ],
        salarioPromedio: "$3,800 - $5,500 USD mensual",
        duracion: "5 años",
        habilidadesClave: ["Diseño genético", "Ingeniería de polímeros", "Química orgánica", "Bioestadística"],
        icono: "Dna"
      },
      no: {
        id: "neuro_med",
        pregunta: "¿Te fascina descifrar los comportamientos complejos, las emociones y la psicología humana?",
        descripcion: "Para decidir si tu interés clínico va por la mente/comportamiento humano o por la medicina clínica general y celular.",
        si: {
          carrera: "Neurociencia Clínica y Psicología",
          desc: "Especialízate en comprender cómo se relaciona el cerebro físico con las emociones, conductas y trastornos del habla, ofreciendo psicoterapia innovadora y diagnóstico de afecciones neurológicas.",
          campoLaboral: [
            "Clínicas de rehabilitación neurocognitiva",
            "Centros de salud mental privados y públicos",
            "Investigación universitaria en comportamiento humano",
            "Consultoría de salud mental deportiva y corporativa"
          ],
          salarioPromedio: "$2,200 - $3,900 USD mensual",
          duracion: "4.5 años",
          habilidadesClave: ["Psicoterapia", "Neurobiología cognitiva", "Diagnóstico clínico", "Empatía terapéutica"],
          icono: "Brain"
        },
        no: {
          carrera: "Medicina General y Especializada",
          desc: "Haz un impacto directo en la vida de miles de personas. Desarrolla diagnósticos clínicos, realiza cirugías complejas y previene epidemias mediante el dominio integral de la anatomía humana.",
          campoLaboral: [
            "Hospitales públicos y privados de alta complejidad",
            "Organizaciones no gubernamentales de salud global",
            "Consultoría médica y telemedicina",
            "Docencia e investigación médica integral"
          ],
          salarioPromedio: "$4,500 - $8,000 USD mensual",
          duracion: "7 años",
          habilidadesClave: ["Anatomía quirúrgica", "Farmacología", "Diagnóstico de urgencias", "Toma de decisiones crítica"],
          icono: "HeartPulse"
        }
      }
    },
    no: {
      id: "interfaz_software",
      pregunta: "¿Te gustaría diseñar la interfaz, componentes de interacción visual y experiencia de usuarios de apps?",
      descripcion: "Define si prefieres el modelado de software y bases de datos lógicas o el diseño visual y interactivo de frontend (UX/UI).",
      si: {
        carrera: "Diseño de Experiencia de Usuario (UX/UI)",
        desc: "Sé el puente emocional entre los usuarios y los productos digitales. Diseña interfaces intuitivas, mapas de navegación, componentes interactivos y realiza pruebas cognitivas para asegurar apps sumamente adictivas.",
        campoLaboral: [
          "Estudios de diseño interactivo globales",
          "Compañías SaaS y tecnológicas (FAANG y startups)",
          "Consultorías de transformación digital corporativa",
          "Freelance de diseño digital internacional"
        ],
        salarioPromedio: "$2,500 - $4,800 USD mensual",
        duracion: "4 años",
        habilidadesClave: ["Figma interactivo", "Arquitectura de información", "Prototipado rápido", "Psicología cognitiva"],
        icono: "Sparkles"
      },
      no: {
        carrera: "Ingeniería de Software e Inteligencia Artificial",
        desc: "Construye el futuro del mundo digital. Aplica algoritmos avanzados, programa sistemas escalables de backend, entrena modelos neuronales de IA y administra infraestructuras en la nube pública.",
        campoLaboral: [
          "Arquitecto de software en startups de IA",
          "Ingeniero de Big Data en corporaciones financieras",
          "Ciberseguridad y auditoría tecnológica global",
          "Desarrollador fullstack autónomo"
        ],
        salarioPromedio: "$4,000 - $7,500 USD mensual",
        duracion: "5 años",
        habilidadesClave: ["Algoritmia y Estructuras de Datos", "Machine Learning", "Cloud Computing (AWS/GCP)", "DevOps integrado"],
        icono: "Code"
      }
    }
  },
  no: {
    id: "creatividad_negocios",
    pregunta: "¿Te inclinas más por actividades creativas, artísticas, de comunicación visual y diseño?",
    descripcion: "Separa a los estudiantes creativos/artísticos de aquellos con vocación hacia el liderazgo empresarial, organización financiera o leyes sociales.",
    si: {
      id: "digital_arte",
      pregunta: "¿Te proyectas diseñando campañas de publicidad digital y la identidad visual de marcas comerciales?",
      descripcion: "Determina si tu interés creativo es puramente de identidad de marca, publicitario digital o te interesan medios artísticos más amplios.",
      si: {
        carrera: "Diseño Gráfico y Dirección de Arte",
        desc: "Traduce ideas en impactos visuales inolvidables. Crea logotipos memorables, dirige la dirección fotográfica de grandes marcas, diseña envases icónicos y define tendencias cromáticas digitales.",
        campoLaboral: [
          "Agencias de publicidad y marketing digital",
          "Departamentos de branding internos de grandes empresas",
          "Editoriales e industrias de empaque y empaquetado",
          "Estudios independientes de diseño visual"
        ],
        salarioPromedio: "$1,800 - $3,200 USD mensual",
        duracion: "4 años",
        habilidadesClave: ["Diseño vectorial", "Teoría del color avanzada", "Branding corporativo", "Tipografía creativa"],
        icono: "Palette"
      },
      no: {
        id: "cine_comunicacion",
        pregunta: "¿Te interesa contar historias a través de formatos escritos, de video, periodísticos o cinematográficos?",
        descripcion: "Esto nos ayuda a decidir si te perfilas para el Periodismo y la Comunicación Digital o si lo tuyo es la cinematografía pura.",
        si: {
          carrera: "Dirección de Cine e Industrias de Video",
          desc: "Toma el asiento del director. Coordina la cinematografía, la actuación, la música y el montaje técnico para construir películas, comerciales cinematográficos, documentales de impacto y videoclips icónicos.",
          campoLaboral: [
            "Productoras de cine y series de streaming (Netflix/Prime)",
            "Dirección de comerciales en agencias creativas",
            "Edición de video y efectos visuales VFX",
            "Producción independiente de videoblogs de alta gama"
          ],
          salarioPromedio: "$2,200 - $5,000 USD mensual",
          duracion: "4 años",
          habilidadesClave: ["Guionismo estructural", "Dirección de cámaras", "Postproducción digital", "Sonorización creativa"],
          icono: "Clapperboard"
        },
        no: {
          carrera: "Comunicación y Periodismo Digital",
          desc: "Domina el arte de informar e influenciar. Crea blogs interactivos, investiga noticias de interés público, gestiona redes de opinión e implementa podcasts informativos de cobertura internacional.",
          campoLaboral: [
            "Medios de comunicación digitales de gran escala",
            "Gestión de relaciones públicas corporativas",
            "Producción independiente de podcasts y videoperiodismo",
            "Análisis de reputación de marca corporativo"
          ],
          salarioPromedio: "$1,600 - $2,800 USD mensual",
          duracion: "4 años",
          habilidadesClave: ["Redacción periodística", "SEO optimizado", "Locución para multimedia", "Investigación crítica"],
          icono: "Megaphone"
        }
      }
    },
    no: {
      id: "liderazgo_leyes",
      pregunta: "¿Te visualizas liderando operaciones comerciales, optimizando finanzas o creando startups?",
      descripcion: "Separa el ámbito corporativo-financiero/emprendimiento del campo humanitario-gubernamental, diplomático y legal de las relaciones internacionales.",
      si: {
        carrera: "Logística, Administración y Emprendimiento",
        desc: "Sé el cerebro operativo de corporaciones globales o de tu propia startup. Diseña estrategias de crecimiento financiero, lidera equipos interdisciplinarios de trabajo y abre nuevos mercados comerciales.",
        campoLaboral: [
          "Fundador de startups respaldadas por capital de riesgo",
          "Consultor estratégico senior en finanzas corporativas",
          "Director de operaciones de multinacionales logísticas",
          "Gestión de inversiones de capital privado"
        ],
        salarioPromedio: "$3,000 - $6,000 USD mensual",
        duracion: "4.5 años",
        habilidadesClave: ["Estrategia empresarial", "Análisis de estados financieros", "Liderazgo inspirador", "Plan de negocios internacional"],
        icono: "Briefcase"
      },
      no: {
        id: "leyes_turismo",
        pregunta: "¿Te apasiona el debate legal, la mediación política, la defensa de derechos y las embajadas?",
        descripcion: "Determina si tu enfoque se orienta a las leyes y relaciones internacionales o a la gestión cultural y servicios turísticos mundiales.",
        si: {
          carrera: "Derecho Corporativo y Relaciones Internacionales",
          desc: "Media conflictos de relevancia transcontinental. Redacta contratos de inversiones internacionales, litiga en cortes superiores y define políticas públicas para embajadas y consulados.",
          campoLaboral: [
            "Bufetes de abogados corporativos de cobertura global",
            "Organizaciones gubernamentales y ministerios de exterior",
            "Cuerpo diplomático de embajadas de todo el mundo",
            "Consultoras de análisis y mitigación de riesgo geopolítico"
          ],
          salarioPromedio: "$2,800 - $5,800 USD mensual",
          duracion: "5 años",
          habilidadesClave: ["Oratoria de debate", "Derecho internacional", "Estrategia diplomática", "Negociación de acuerdos"],
          icono: "Scale"
        },
        no: {
          carrera: "Gestión Cultural y Hotelería Internacional",
          desc: "Dirige el intercambio cultural de carácter hospitalario de primer nivel. Diseña festivales mundiales, administra resorts de gran turismo y abre ventanas de aventura ecológica en parajes recónditos.",
          campoLaboral: [
            "Gerencia general en cadenas hoteleras transnacionales",
            "Diseño de rutas ecoturísticas comunitarias de gran impacto",
            "Dirección de museos y ministerios de cultura",
            "Operadoras mayoristas de aventuras exclusivas"
          ],
          salarioPromedio: "$2,000 - $3,800 USD mensual",
          duracion: "4 años",
          habilidadesClave: ["Administración de resorts", "Gestión de festivales artísticos", "Multilingüismo avanzado", "Atención al huésped premium"],
          icono: "Compass"
        }
      }
    }
  }
};

// Datos oficiales y proyecciones sintetizadas del informe Future of Jobs (World Economic Forum 2025-2030)
// e investigaciones complementarias sobre el impacto de la Inteligencia Artificial en el mercado laboral.

export const HERO_GLOBAL_STATS = {
  netJobCreation: "+78M",
  netJobCreationNumber: 78000000,
  newRolesCreated: "170M",
  newRolesNumber: 170000000,
  displacedJobs: "92M",
  displacedJobsNumber: 92000000,
  tasksAutomated2030: 48,
  tasksHuman2030: 52,
  tasksAutomated2023: 34,
  tasksHuman2023: 66,
  skillChurnPercent: 39,
  aiAdoptionCompanies: 86,
  skillsGapBarrier: 63,
  sourceReport: "World Economic Forum - Future of Jobs Report 2025/2030 Projections"
};

export const SECTORS_LIST = [
  { id: "all", name: "Todos los Sectores", icon: "Globe" },
  { id: "tech", name: "Tecnología & Software", icon: "Cpu" },
  { id: "finance", name: "Servicios Financieros", icon: "TrendingUp" },
  { id: "health", name: "Salud & Biotecnología", icon: "Activity" },
  { id: "education", name: "Educación & Formación", icon: "BookOpen" },
  { id: "industry", name: "Manufactura & Energía", icon: "Zap" },
  { id: "retail", name: "Comercio & Logística", icon: "ShoppingBag" }
];

export const REGIONS_LIST = [
  { id: "global", name: "Global" },
  { id: "latam", name: "América Latina" },
  { id: "north_america", name: "Norteamérica" },
  { id: "europe", name: "Europa" },
  { id: "asia", name: "Asia-Pacífico" }
];

export const REGIONAL_METRICS = {
  global: {
    netCreation: "+78M",
    growthLeader: "Especialista en IA & Big Data",
    vulnerableShare: "22%",
    automationRate: "48%",
    insight: "Transformación acelerada por adopción de agentes autónomos y computación en la nube."
  },
  latam: {
    netCreation: "+8.4M",
    growthLeader: "Desarrollador FinTech & Datos",
    vulnerableShare: "26%",
    automationRate: "42%",
    insight: "Alta oportunidad en digitalización bancaria y exportación de servicios tecnológicos de nearshoring."
  },
  north_america: {
    netCreation: "+21M",
    growthLeader: "Arquitecto de Soluciones IA",
    vulnerableShare: "20%",
    automationRate: "52%",
    insight: "Mayor velocidad de sustitución de tareas ofimáticas y fuerte inversión en infraestructura de supercómputo."
  },
  europe: {
    netCreation: "+16M",
    growthLeader: "Experto en Ciberseguridad & Sostenibilidad",
    vulnerableShare: "19%",
    automationRate: "47%",
    insight: "Marco regulatorio estricto (EU AI Act) estimula roles de cumplimiento ético y ciberresiliencia."
  },
  asia: {
    netCreation: "+32M",
    growthLeader: "Ingeniero de Robótica & Hardware IA",
    vulnerableShare: "24%",
    automationRate: "50%",
    insight: "Liderazgo en automatización de fábricas, robótica humanoide y semiconductores."
  }
};

export const TOP_GROWING_JOBS = [
  {
    id: "ai-specialist",
    name: "Especialista en IA y Machine Learning",
    sector: "tech",
    growthRate: "+54%",
    growthValue: 54,
    demandLevel: "Excepcional",
    avgSalaryUSD: "$115,000 - $190,000",
    automationRisk: "7% (Muy Bajo)",
    riskTier: "low",
    description: "Diseño, entrenamiento y supervisión de modelos neuronales profundos, LLMs y sistemas autónomos.",
    keySkills: ["Modelos Fundacionales", "Python / PyTorch", "Fine-tuning", "MLOps", "Pensamiento Crítico"],
    aiRole: "Creador directo del ecosistema de inteligencia artificial",
    icon: "Sparkles"
  },
  {
    id: "big-data",
    name: "Especialista en Big Data y Pipelines",
    sector: "tech",
    growthRate: "+39%",
    growthValue: 39,
    demandLevel: "Muy Alta",
    avgSalaryUSD: "$95,000 - $155,000",
    automationRisk: "12% (Bajo)",
    riskTier: "low",
    description: "Estructuración de arquitecturas de datos masivos para alimentar analítica predictiva y modelos de lenguaje.",
    keySkills: ["Data Lakes", "SQL Avanzado", "Apache Spark", "Cloud Architecture", "Gobierno de Datos"],
    aiRole: "Ingeniería de la materia prima que alimenta a los algoritmos",
    icon: "Database"
  },
  {
    id: "fintech-engineer",
    name: "Ingeniero FinTech & Sistemas Descentralizados",
    sector: "finance",
    growthRate: "+36%",
    growthValue: 36,
    demandLevel: "Muy Alta",
    avgSalaryUSD: "$90,000 - $150,000",
    automationRisk: "15% (Bajo)",
    riskTier: "low",
    description: "Desarrollo de pasarelas algorítmicas, detección de fraude en tiempo real con IA y finanzas automatizadas.",
    keySkills: ["Algoritmos Antifraude", "APIs Financieras", "Criptografía", "Cumplimiento Regulatorio"],
    aiRole: "Automatización inteligente de operaciones de capital",
    icon: "BadgeDollarSign"
  },
  {
    id: "cybersecurity-expert",
    name: "Experto en Ciberseguridad & Resiliencia Digital",
    sector: "tech",
    growthRate: "+32%",
    growthValue: 32,
    demandLevel: "Crítica",
    avgSalaryUSD: "$100,000 - $165,000",
    automationRisk: "10% (Muy Bajo)",
    riskTier: "low",
    description: "Protección de infraestructura crítica frente a ataques cibernéticos generados por IA maliciosa.",
    keySkills: ["Zero Trust", "Defensa contra Phishing IA", "Criptografía Post-Cuántica", "Auditoría de Sistemas"],
    aiRole: "Defensa contra vectores de amenaza asistidos por IA",
    icon: "ShieldCheck"
  },
  {
    id: "renewables-engineer",
    name: "Ingeniero en Energías Renovables & Sostenibilidad",
    sector: "industry",
    growthRate: "+28%",
    growthValue: 28,
    demandLevel: "Alta",
    avgSalaryUSD: "$85,000 - $135,000",
    automationRisk: "11% (Bajo)",
    riskTier: "low",
    description: "Optimización de redes eléctricas inteligentes y centros de datos verdes impulsados por predicción meteorológica IA.",
    keySkills: ["Smart Grids", "Eficiencia Energética", "Modelado de Recursos", "Gestión de Baterías"],
    aiRole: "Sostenibilidad de la infraestructura física del cómputo",
    icon: "Sun"
  },
  {
    id: "uiux-ai-designer",
    name: "Diseñador de Interacción Humano-IA (UI/UX)",
    sector: "tech",
    growthRate: "+25%",
    growthValue: 25,
    demandLevel: "Alta",
    avgSalaryUSD: "$80,000 - $130,000",
    automationRisk: "18% (Bajo)",
    riskTier: "low",
    description: "Diseño de interfaces conversacionales, flujos de co-creación con agentes autónomos y transparencia de IA.",
    keySkills: ["Prompt Design", "Psicología Cognitiva", "Prototipado Figma/AI", "Accesibilidad"],
    aiRole: "Puente empático y funcional entre personas y sistemas inteligentes",
    icon: "Palette"
  }
];

export const TOP_DECLINING_JOBS = [
  {
    id: "data-entry",
    name: "Empleado de Entrada y Digitador de Datos",
    sector: "retail",
    growthRate: "-38%",
    declineValue: 38,
    riskLevel: "Crítico",
    avgSalaryUSD: "$24,000 - $36,000",
    automationRisk: "94% (Inminente)",
    riskTier: "critical",
    description: "Captura rutinaria de documentos, formularios y hojas de cálculo que los modelos de visión e IA procesan en segundos.",
    vulnerableTasks: ["Transcripción de facturas", "Copia entre hojas de cálculo", "Verificación manual de campos"],
    bestReskillingTarget: "Analista Junior de Calidad de Datos & BI",
    icon: "FileSpreadsheet"
  },
  {
    id: "admin-assistant",
    name: "Asistente Administrativo y Secretaria Ejecutiva",
    sector: "education",
    growthRate: "-34%",
    declineValue: 34,
    riskLevel: "Muy Alto",
    avgSalaryUSD: "$30,000 - $44,000",
    automationRisk: "82% (Alto)",
    riskTier: "high",
    description: "Agendamiento, redacción de correos estándar y minutas sustituidas por asistentes virtuales y agentes LLM.",
    vulnerableTasks: ["Resumen de juntas", "Gestión de calendario", "Respuestas a correos recurrentes"],
    bestReskillingTarget: "Operations & AI Workflow Specialist",
    icon: "MailCheck"
  },
  {
    id: "bank-teller",
    name: "Cajero Bancario y Empleado de Ventanilla",
    sector: "finance",
    growthRate: "-32%",
    declineValue: 32,
    riskLevel: "Muy Alto",
    avgSalaryUSD: "$28,000 - $40,000",
    automationRisk: "87% (Alto)",
    riskTier: "high",
    description: "Transacciones en ventanilla totalmente absorbidas por banca móvil, biometría y cajeros inteligentes con IA.",
    vulnerableTasks: ["Retiros y depósitos en efectivo", "Consulta de saldos", "Validación básica de cheques"],
    bestReskillingTarget: "Asesor Financiero Personalizado & FinTech",
    icon: "CreditCard"
  },
  {
    id: "accounting-clerk",
    name: "Contador Tradicional y Tenedor de Libros",
    sector: "finance",
    growthRate: "-29%",
    declineValue: 29,
    riskLevel: "Alto",
    avgSalaryUSD: "$36,000 - $55,000",
    automationRisk: "76% (Alto)",
    riskTier: "high",
    description: "Conciliación bancaria, cálculo de impuestos rutinarios y reportes de nómina automatizados mediante software ERP moderno.",
    vulnerableTasks: ["Conciliación de balances mensuales", "Cálculo de retenciones fiscales mecánicas", "Registro de comprobantes"],
    bestReskillingTarget: "Consultor Estratégico Fiscal & Auditor de IA",
    icon: "Calculator"
  },
  {
    id: "telemarketer",
    name: "Teleoperador de Ventas & Llamadas Salientes",
    sector: "retail",
    growthRate: "-30%",
    declineValue: 30,
    riskLevel: "Crítico",
    avgSalaryUSD: "$22,000 - $35,000",
    automationRisk: "91% (Inminente)",
    riskTier: "critical",
    description: "Llamadas en frío y prospección guiada por guiones reemplazadas por agentes de voz hiperrealistas con IA conversacional.",
    vulnerableTasks: ["Lectura de guiones comerciales", "Calificación preliminar de prospectos", "Remarcado telefónico"],
    bestReskillingTarget: "Especialista en Experiencia del Cliente (CX) B2B",
    icon: "PhoneOff"
  },
  {
    id: "claims-adjuster",
    name: "Ajustador de Reclamos y Evaluador de Pólizas",
    sector: "finance",
    growthRate: "-24%",
    declineValue: 24,
    riskLevel: "Alto",
    avgSalaryUSD: "$40,000 - $60,000",
    automationRisk: "71% (Alto)",
    riskTier: "high",
    description: "Inspección de daños vehiculares o reclamos médicos evaluados automáticamente mediante visión artificial y análisis de póliza.",
    vulnerableTasks: ["Revisión fotográfica de siniestros leves", "Cálculo estándar de indemnización", "Comprobación de deducible"],
    bestReskillingTarget: "Investigador Forense de Fraude Complejo",
    icon: "FileWarning"
  }
];

export const TOP_SKILLS = [
  {
    id: "analytical-thinking",
    name: "Pensamiento Analítico e Interpretación Crítica",
    category: "cognitive",
    categoryLabel: "Cognitiva",
    demandPercent: 74,
    growthRate: "+18%",
    importanceRank: 1,
    description: "Capacidad de descomponer problemas intrincados, evaluar la solidez de los outputs generados por IA y detectar sesgos.",
    color: "from-cyan-500 to-blue-600"
  },
  {
    id: "ai-literacy",
    name: "Alfabetización en IA, Prompts y Datos",
    category: "technological",
    categoryLabel: "Tecnológica",
    demandPercent: 70,
    growthRate: "+45%",
    importanceRank: 2,
    description: "Destreza para formular instrucciones de alta precisión, orquestar flujos de trabajo multi-modelo y auditar respuestas.",
    color: "from-purple-500 to-indigo-600"
  },
  {
    id: "creative-thinking",
    name: "Pensamiento Creativo y Generación de Ideas",
    category: "cognitive",
    categoryLabel: "Cognitiva",
    demandPercent: 67,
    growthRate: "+15%",
    importanceRank: 3,
    description: "Conexión interdisciplinaria de conceptos divergentes, originalidad conceptual y formulación de preguntas inéditas.",
    color: "from-pink-500 to-rose-600"
  },
  {
    id: "resilience-agility",
    name: "Resiliencia, Flexibilidad y Agilidad Mental",
    category: "human",
    categoryLabel: "Humana / Emocional",
    demandPercent: 62,
    growthRate: "+21%",
    importanceRank: 4,
    description: "Adaptación serena ante transformaciones constantes de herramientas, desaprendizaje activo y tolerancia a la ambigüedad.",
    color: "from-emerald-500 to-teal-600"
  },
  {
    id: "cybersecurity-mindset",
    name: "Ciberseguridad y Gestión de Privacidad",
    category: "technological",
    categoryLabel: "Tecnológica",
    demandPercent: 59,
    growthRate: "+27%",
    importanceRank: 5,
    description: "Protección de propiedad intelectual, custodia de datos sensibles y mitigación de ataques de inyección de prompts.",
    color: "from-blue-500 to-cyan-600"
  },
  {
    id: "leadership-empathy",
    name: "Liderazgo, Inteligencia Emocional e Influencia",
    category: "human",
    categoryLabel: "Humana / Emocional",
    demandPercent: 57,
    growthRate: "+19%",
    importanceRank: 6,
    description: "Inspiración de equipos híbridos (humanos y agentes sintéticos), mediación de conflictos y empatía profunda en toma de decisiones.",
    color: "from-amber-500 to-orange-600"
  },
  {
    id: "continuous-learning",
    name: "Curiosidad Intelectual y Aprendizaje Continuo",
    category: "human",
    categoryLabel: "Humana / Emocional",
    demandPercent: 53,
    growthRate: "+22%",
    importanceRank: 7,
    description: "Hábito autónomo de explorar avances emergentes semanalmente y actualizar habilidades de forma proactiva.",
    color: "from-violet-500 to-purple-600"
  },
  {
    id: "ai-ethics",
    name: "Gobernanza Ética y Auditoría Algorítmica",
    category: "technological",
    categoryLabel: "Tecnológica",
    demandPercent: 49,
    growthRate: "+38%",
    importanceRank: 8,
    description: "Evaluación de equidad, reducción de sesgos discriminatorios y cumplimiento normativo en implementaciones de IA.",
    color: "from-rose-500 to-pink-600"
  }
];

export const SIMULATOR_ROLES = [
  {
    id: "contador",
    title: "Contador / Tenedor de Libros",
    sector: "finance",
    automationScore: 78,
    riskLevel: "Alto",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
    summary: "Las tareas mecánicas de conciliación y llenado de formularios fiscales están casi 100% automatizadas.",
    aiWillDo: [
      "Conciliación bancaria instantánea de extractos",
      "Clasificación automática de comprobantes y facturas con OCR",
      "Generación automática de balances de comprobación y libros de diario",
      "Detección preliminar de discrepancias numéricas recurrentes"
    ],
    humanWillDo: [
      "Planificación y asesoramiento fiscal estratégico para optimización de impuestos",
      "Negociación y representación ante autoridades hacendarias y auditorías",
      "Consultoría financiera integral para fusiones, adquisiciones y toma de riesgo",
      "Auditoría forense para destapar fraudes intencionales complejos"
    ],
    survivalAdvice: "Evoluciona de la teneduría de libros hacia la asesoría estratégica de negocios. Domina herramientas de BI (Power BI, Tableau) y auditoría asistida por IA.",
    targetTransitionRole: "Consultor Estratégico Financiero & Auditor de IA"
  },
  {
    id: "data-entry",
    title: "Digitador / Capturista de Datos",
    sector: "retail",
    automationScore: 92,
    riskLevel: "Crítico",
    badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    summary: "Uno de los roles con mayor velocidad de desplazamiento debido a modelos multimodales que leen cualquier formato al instante.",
    aiWillDo: [
      "Extracción de datos no estructurados de PDFs, imágenes y formularios web",
      "Validación de campos, formatos de fecha, RUT/RFC y direcciones",
      "Migración masiva de registros entre bases de datos legadas y nubes",
      "Limpieza y estandarización de strings y tablas"
    ],
    humanWillDo: [
      "Definición de reglas de negocio para calidad de datos (Data Quality Governance)",
      "Resolución de excepciones que requieren contexto humano no documentado",
      "Tratamiento de disputas con clientes sobre datos personales sensibles",
      "Diseño de la arquitectura de recolección de información en campo"
    ],
    survivalAdvice: "La captura manual desaparecerá. Es urgente migrar hacia Analista de Datos Junior, Gestión de Bases de Datos SQL o Control de Calidad de Datos.",
    targetTransitionRole: "Analista de Datos & Business Intelligence"
  },
  {
    id: "software-dev",
    title: "Desarrollador de Software / Programador Web",
    sector: "tech",
    automationScore: 35,
    riskLevel: "Bajo - Moderado",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    summary: "La IA escribe código rutinario (boilerplate, regex, CRUDs), pero los ingenieros ahora orquestan sistemas a nivel arquitectónico y de producto.",
    aiWillDo: [
      "Generación de código repetitivo, componentes estándar y pruebas unitarias",
      "Detección de errores sintácticos comunes y refactorización sintáctica",
      "Traducción de fragmentos entre diferentes lenguajes de programación",
      "Búsqueda instantánea de documentación y snippets de librerías"
    ],
    humanWillDo: [
      "Diseño de arquitectura de software escalable y tolerante a fallos",
      "Traducción de requerimientos ambiguos de clientes de negocio en soluciones técnicas",
      "Garantía de seguridad, privacidad y compliance de datos de usuarios",
      "Orquestación de pipelines complejos e integración de agentes de IA autónomos"
    ],
    survivalAdvice: "Pasa de ser un 'escritor de código' a un 'arquitecto de soluciones asistido por IA'. Multiplica tu productividad 5x usando Copilots y agentes autónomos.",
    targetTransitionRole: "Arquitecto de Software & Agentes de IA"
  },
  {
    id: "graphic-designer",
    title: "Diseñador Gráfico / Creativo Visual",
    sector: "tech",
    automationScore: 65,
    riskLevel: "Medio - Alto",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    summary: "Los banners básicos, ilustraciones de stock y retoques fotográficos son generados en segundos por Midjourney, FLUX y DALL-E.",
    aiWillDo: [
      "Generación de variaciones de imágenes, ilustraciones y texturas",
      "Recorte de fondos, reiluminación y escalado de resolución (upscaling)",
      "Creación de plantillas para redes sociales y adaptaciones de formatos",
      "Colorización y estilización visual automática según un prompt"
    ],
    humanWillDo: [
      "Conceptualización del storytelling de marca y resonancia emocional",
      "Dirección de arte holística y cohesión de identidad corporativa",
      "Diseño de experiencias interactivas y empatía con la psicología del usuario",
      "Curaduría estética y validación de autenticidad cultural de campañas"
    ],
    survivalAdvice: "Adopta las herramientas de IA generativa como tu pincel de superpoderes. Conviértete en Director Creativo de IA y Diseñador de Experiencias (UX/UI).",
    targetTransitionRole: "Diseñador de Interacción Humano-IA (UI/UX)"
  },
  {
    id: "customer-service",
    title: "Agente de Servicio al Cliente / Call Center",
    sector: "retail",
    automationScore: 84,
    riskLevel: "Crítico",
    badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    summary: "Los bots de lenguaje natural y voces sintéticas fluidas resuelven preguntas frecuentes en cientos de idiomas 24/7 sin tiempo de espera.",
    aiWillDo: [
      "Respuestas inmediatas a dudas sobre envíos, políticas de devolución y horarios",
      "Restablecimiento de contraseñas y desbloqueo de cuentas",
      "Enrutamiento inteligente de tickets según sentimiento y urgencia",
      "Resumen en tiempo real del historial del cliente y llamadas previas"
    ],
    humanWillDo: [
      "Manejo de clientes en estados de alta frustración que requieren empatía genuina",
      "Gestión de casos de crisis reputacional o demandas legales",
      "Negociación de acuerdos especiales y excepciones fuera del manual",
      "Capacitación, supervisión y calibración del tono empático de los bots"
    ],
    survivalAdvice: "Especialízate en 'Customer Success' de alto valor, retención de cuentas B2B o en el diseño y auditoría de flujos conversacionales de IA.",
    targetTransitionRole: "Specialist en Customer Success B2B & Conversational AI"
  },
  {
    id: "legal-assistant",
    title: "Asistente Legal / Paralegal",
    sector: "education",
    automationScore: 72,
    riskLevel: "Alto",
    badgeColor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    summary: "La revisión de miles de contratos en busca de cláusulas de riesgo o jurisprudencia ahora toma segundos con modelos especializados.",
    aiWillDo: [
      "Búsqueda semántica de precedentes y jurisprudencia relevante",
      "Revisión de contratos estándar (NDAs, arrendamientos) e identificación de anomalías",
      "Redacción preliminar de escritos legales de rutina",
      "Comparación de versiones de documentos contractuales masivos"
    ],
    humanWillDo: [
      "Estrategia procesal y argumentación persuasiva ante tribunales",
      "Negociación directa con la contraparte y lectura de lenguaje corporal",
      "Juicio ético sobre repercusiones morales y sociales de un litigio",
      "Construcción de confianza íntima con clientes en momentos críticos"
    ],
    survivalAdvice: "Integra LegalTech e IA en tu flujo diario. Enfócate en el asesoramiento estratégico de alto nivel, litigación compleja y compliance regulatorio de IA.",
    targetTransitionRole: "Consultor LegalTech & Compliance en IA"
  },
  {
    id: "doctor-radiologist",
    title: "Médico Especialista / Radiólogo",
    sector: "health",
    automationScore: 28,
    riskLevel: "Bajo",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    summary: "La IA supera al ojo humano detectando microlesiones en resonancias, pero el diagnóstico integral y la relación médico-paciente son irreemplazables.",
    aiWillDo: [
      "Detección preliminar de anomalías en radiografías, TACs y biopsias",
      "Cruce masivo de literatura médica global para sugerir interacciones farmacológicas",
      "Transcripción automática de historias clínicas durante la consulta",
      "Monitoreo continuo de bioseñales de pacientes en cuidados intensivos"
    ],
    humanWillDo: [
      "Comunicación empática de diagnósticos graves y acompañamiento paliativo",
      "Intervenciones quirúrgicas complejas con adaptaciones en tiempo real",
      "Decisiones éticas sobre tratamientos experimentales y balance de calidad de vida",
      "Integración holística de factores socioeconómicos y psicológicos del paciente"
    ],
    survivalAdvice: "Aprende a colaborar con algoritmos de diagnóstico asistido. Los médicos que utilicen IA reemplazarán a los médicos que se nieguen a usarla.",
    targetTransitionRole: "Especialista en Medicina de Precisión Asistida por IA"
  },
  {
    id: "teacher-educator",
    title: "Docente / Profesor de Escuela y Universidad",
    sector: "education",
    automationScore: 32,
    riskLevel: "Bajo",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    summary: "La IA genera material didáctico y califica exámenes mecánicos, liberando al profesor para actuar como mentor, motivador y guía socrático.",
    aiWillDo: [
      "Generación de planes de clase, rúbricas de evaluación y cuestionarios",
      "Calificación automatizada de tareas objetivas y detección de plagio",
      "Adaptación del ritmo y nivel de ejercicios a cada alumno mediante tutores IA",
      "Traducción y síntesis de fuentes bibliográficas para los alumnos"
    ],
    humanWillDo: [
      "Desarrollo socioemocional, empatía y valores éticos en los estudiantes",
      "Inspiración, motivación vocacional y contención ante el fracaso",
      "Dirección de debates socráticos y pensamiento crítico cara a cara",
      "Resolución de problemas de conducta, acoso y dinámicas grupales"
    ],
    survivalAdvice: "Transforma tu aula en un laboratorio de pensamiento crítico. Enseña a tus alumnos a cuestionar a la IA y aprovecha los tutores virtuales para personalización.",
    targetTransitionRole: "Diseñador Pedagógico de Aprendizaje Aumentado"
  },
  {
    id: "marketing-manager",
    title: "Gerente de Marketing Digital",
    sector: "retail",
    automationScore: 48,
    riskLevel: "Moderado",
    badgeColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    summary: "La optimización de pujas, segmentación de anuncios y redacción de copys es automática; la visión de marca y la conexión humana marcan la diferencia.",
    aiWillDo: [
      "Optimización de presupuestos de pauta publicitaria en tiempo real (Google/Meta)",
      "Pruebas A/B automáticas de títulos, imágenes y llamados a la acción",
      "Análisis de sentimiento masivo en redes sociales",
      "Redacción preliminar de notas de blog y newsletters estándar"
    ],
    humanWillDo: [
      "Definición del posicionamiento de marca único y contracorriente",
      "Alianzas estratégicas con otras marcas, creadores y comunidades",
      "Lectura de movimientos culturales y tendencias emergentes sutiles",
      "Alineación del producto con valores éticos y sostenibles auténticos"
    ],
    survivalAdvice: "Domina la automatización de embudos con agentes autónomos y enfócate en el marketing basado en comunidad y autenticidad humana.",
    targetTransitionRole: "Growth & AI Strategy Director"
  }
];

export const RESKILLING_PATHS = [
  {
    id: "path-data-analyst",
    fromTitle: "Digitador de Datos / Asistente Administrativo",
    toTitle: "Analista de Inteligencia de Negocios (BI) & Datos",
    estimatedMonths: "6 a 9 meses",
    salaryIncrease: "+85%",
    difficulty: "Media",
    overview: "Pasa de ingresar datos mecánicamente a construir tableros interactivos que dirigen decisiones estratégicas millonarias.",
    phases: [
      {
        step: 1,
        title: "Fase 1: Fundamentos de Datos & SQL Moderno",
        duration: "Mes 1 - 2",
        topics: ["Modelado relacional de datos", "Consultas SQL avanzadas (JOINs, Window Functions)", "Higiene y gobernanza de datos"],
        tools: ["PostgreSQL", "Google BigQuery", "DBeaver"],
        recommendedCourse: "Google Data Analytics Professional Certificate (Coursera) / SQL for Data Science (UC Davis)",
        completed: false
      },
      {
        step: 2,
        title: "Fase 2: Visualización de Impacto & Storytelling",
        duration: "Mes 3 - 5",
        topics: ["Diseño de dashboards ejecutivos", "Métricas clave de negocio (CAC, LTV, Churn)", "Narrativa de datos para directores"],
        tools: ["Power BI", "Tableau", "Looker Studio"],
        recommendedCourse: "Data Visualization with Tableau Specialization (Coursera)",
        completed: false
      },
      {
        step: 3,
        title: "Fase 3: Analítica Aumentada con IA & Portafolio",
        duration: "Mes 6 - 8",
        topics: ["Automatización con Python básico y Pandas", "Uso de Code Interpreter y asistentes IA para insights", "Publicación de 3 proyectos en GitHub y LinkedIn"],
        tools: ["Python / Jupyter", "ChatGPT Data Analyst", "GitHub"],
        recommendedCourse: "Python for Everybody (University of Michigan) / Harvard CS50 Data Science",
        completed: false
      }
    ],
    keySoftSkills: ["Pensamiento crítico", "Comunicación ejecutiva", "Curiosidad investigativa"]
  },
  {
    id: "path-ai-specialist",
    fromTitle: "Desarrollador Web Tradicional / Programador",
    toTitle: "Ingeniero de Aplicaciones IA & Flujos Agénticos",
    estimatedMonths: "4 a 6 meses",
    salaryIncrease: "+65%",
    difficulty: "Media - Alta",
    overview: "Transita de crear páginas y CRUDs básicos a orquestar modelos de lenguaje, bases de datos vectoriales y agentes autónomos.",
    phases: [
      {
        step: 1,
        title: "Fase 1: Fundamentos de LLMs y Prompt Engineering Avanzado",
        duration: "Mes 1",
        topics: ["Tokens, embeddings y arquitecturas transformer", "Técnicas Chain-of-Thought, ReAct y Few-Shot", "Mitigación de alucinaciones"],
        tools: ["OpenAI API", "Anthropic Claude SDK", "Gemini API"],
        recommendedCourse: "Generative AI for Everyone (Andrew Ng / DeepLearning.AI)",
        completed: false
      },
      {
        step: 2,
        title: "Fase 2: Arquitecturas RAG & Bases de Datos Vectoriales",
        duration: "Mes 2 - 3",
        topics: ["Retrieval-Augmented Generation (RAG)", "Chunking semántico y embeddings", "Búsqueda híbrida y reranking"],
        tools: ["LangChain", "LlamaIndex", "Pinecone / ChromaDB"],
        recommendedCourse: "LangChain for LLM Application Development (DeepLearning.AI)",
        completed: false
      },
      {
        step: 3,
        title: "Fase 3: Sistemas Agénticos Autónomos & MLOps",
        duration: "Mes 4 - 6",
        topics: ["Orquestación multi-agente con herramientas", "Evaluación de calidad de respuestas (Ragas, TruLens)", "Despliegue escalable en producción"],
        tools: ["LangGraph", "CrewAI", "Docker / Cloud Run"],
        recommendedCourse: "AI Agents in Practice (DeepLearning.AI) / CS229 Stanford",
        completed: false
      }
    ],
    keySoftSkills: ["Pensamiento sistémico", "Resolución de problemas abiertos", "Ética de sistemas autónomos"]
  },
  {
    id: "path-operations-ai",
    fromTitle: "Asistente Administrativo / Coordinador de Oficina",
    toTitle: "Operations & AI Workflow Manager",
    estimatedMonths: "3 a 5 meses",
    salaryIncrease: "+50%",
    difficulty: "Accesible",
    overview: "Conviértete en el estratega que automatiza los procesos manuales de la empresa conectando herramientas con IA sin programar.",
    phases: [
      {
        step: 1,
        title: "Fase 1: Automatización No-Code & Conexión de Apps",
        duration: "Mes 1 - 2",
        topics: ["Triggers, webhooks y flujos condicionales", "Conexión de CRM, correo y hojas de cálculo", "Optimización de tiempos de respuesta"],
        tools: ["Zapier", "Make.com", "Notion Databases"],
        recommendedCourse: "No-Code Automation Masterclass (Make Academy)",
        completed: false
      },
      {
        step: 2,
        title: "Fase 2: Integración de IA en Procesos de Negocio",
        duration: "Mes 2 - 3",
        topics: ["Agentes de extracción documental automática", "Clasificación inteligente de leads y soporte", "Generación de minutas y tareas post-reunión"],
        tools: ["ChatGPT Team", "Claude Projects", "Fireflies.ai / Otter"],
        recommendedCourse: "AI in Business Strategy (MIT Sloan Executive Education)",
        completed: false
      },
      {
        step: 3,
        title: "Fase 3: Gestión del Cambio & Adopción en Equipos",
        duration: "Mes 4 - 5",
        topics: ["Capacitación de personal en herramientas IA", "Creación de manuales de uso ético interno", "Auditoría de ahorro de horas hombre"],
        tools: ["Loom", "Slack Workflows", "Google Workspace AI"],
        recommendedCourse: "Leading Change in Organizations (Wharton Online)",
        completed: false
      }
    ],
    keySoftSkills: ["Liderazgo facilitador", "Empatía organizacional", "Organización metódica"]
  }
];

export const ROI_SKILLS_DATA = [
  {
    id: "prompt-genai",
    name: "Ingeniería de Prompts & Agentes de IA",
    category: "Tecnología Aplicada",
    baseSalaryMultiplier: 1.28, // +28%
    studyHoursNeeded: 120,
    costUSD: 250,
    timeMonths: 3,
    highDemandSectors: ["Tecnología", "Marketing", "Consultoría"],
    highlight: "Multiplicador de productividad inmediato en cualquier labor ofimática."
  },
  {
    id: "data-bi",
    name: "Big Data & Business Intelligence (Power BI / SQL)",
    category: "Analítica Estratégica",
    baseSalaryMultiplier: 1.35, // +35%
    studyHoursNeeded: 220,
    costUSD: 400,
    timeMonths: 6,
    highDemandSectors: ["Finanzas", "Retail", "Manufactura"],
    highlight: "Puesto de alta estabilidad; convierte datos brutos en decisiones monetizables."
  },
  {
    id: "cybersecurity",
    name: "Ciberseguridad & Resiliencia de Sistemas",
    category: "Infraestructura Crítica",
    baseSalaryMultiplier: 1.42, // +42%
    studyHoursNeeded: 350,
    costUSD: 650,
    timeMonths: 8,
    highDemandSectors: ["Banca", "Gobierno", "Salud"],
    highlight: "Déficit global de más de 4 millones de profesionales; salarios en máximos."
  },
  {
    id: "ai-leadership",
    name: "Liderazgo de Equipos Híbridos & Ética de IA",
    category: "Habilidades Humanas",
    baseSalaryMultiplier: 1.30, // +30%
    studyHoursNeeded: 140,
    costUSD: 350,
    timeMonths: 4,
    highDemandSectors: ["Todos los sectores directivos"],
    highlight: "La capacidad de guiar personas mientras se adoptan tecnologías disruptivas."
  }
];

export const EXECUTIVE_AUDIO_SUMMARY = `Informe ejecutivo sobre el Futuro del Empleo en la era de la Inteligencia Artificial, basado en las proyecciones del Foro Económico Mundial. 
Hacia el año 2030, la economía global experimentará una profunda reconfiguración: se proyecta la creación neta de 78 millones de nuevos empleos, con 170 millones de nuevos puestos emergentes y 92 millones desplazados. 
El equilibrio operativo alcanzará un 48 por ciento de tareas automatizadas por algoritmos y máquinas, frente a un 52 por ciento realizadas por el criterio humano. 
Los roles de mayor auge incluyen especialistas en inteligencia artificial, analistas de datos, ingenieros fintech y expertos en ciberseguridad. En contraste, las tareas rutinarias como digitación de datos, atención telefónica básica y teneduría de libros enfrentan una reducción superior al 30 por ciento. 
La principal ventaja competitiva no reside en competir contra la tecnología, sino en dominar el pensamiento analítico, la creatividad y la agilidad de aprendizaje. El momento de comenzar la transición profesional es ahora.`;

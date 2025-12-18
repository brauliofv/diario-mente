// js/constants.js
export const GOOGLE_CLIENT_ID = '530533358042-48sb9o9cj7ebqa7j7rj4lvsouka9gj3t.apps.googleusercontent.com'; // <--- IMPORTANTE: REEMPLAZAR
export const GOOGLE_API_KEY = ''; // Opcional si usas solo flujo implícito

export const AppStep = {
    WELCOME: 'WELCOME',
    MORNING_RECALL: 'MORNING_RECALL',
    MID_MORNING_RECALL: 'MID_MORNING_RECALL',
    MEMORY_ENCODING: 'MEMORY_ENCODING',
    AFTERNOON_RECALL: 'AFTERNOON_RECALL',
    MID_AFTERNOON_RECALL: 'MID_AFTERNOON_RECALL',
    SPATIAL_RECALL: 'SPATIAL_RECALL',
    ANECDOTE: 'ANECDOTE',
    MEMORY_RETRIEVAL: 'MEMORY_RETRIEVAL',
    ANALYSIS: 'ANALYSIS',
    COMPLETED: 'COMPLETED',
    HISTORY: 'HISTORY'
};

// Configuración para la Barra de Progreso
export const PROGRESS_MAP = {
    [AppStep.MORNING_RECALL]: 10,
    [AppStep.MID_MORNING_RECALL]: 22,
    [AppStep.MEMORY_ENCODING]: 35,
    [AppStep.AFTERNOON_RECALL]: 48,
    [AppStep.MID_AFTERNOON_RECALL]: 60,
    [AppStep.SPATIAL_RECALL]: 72,
    [AppStep.ANECDOTE]: 85,
    [AppStep.MEMORY_RETRIEVAL]: 100
};

export const MEMORY_ITEMS_POOL = [
    { id: '1', emoji: '🚲', name: 'Bicicleta' },
    { id: '2', emoji: '🎸', name: 'Guitarra' },
    { id: '3', emoji: '🌵', name: 'Cactus' },
    { id: '4', emoji: '🍕', name: 'Pizza' },
    { id: '5', emoji: '🚀', name: 'Cohete' },
    { id: '6', emoji: '🎈', name: 'Globo' },
    { id: '7', emoji: '⏰', name: 'Reloj' },
    { id: '8', emoji: '🔑', name: 'Llave' },
    { id: '9', emoji: '🍦', name: 'Helado' },
    { id: '10', emoji: '📚', name: 'Libros' },
    // ... agregar resto de items
];

export const PROMPTS = {
    [AppStep.MORNING_RECALL]: {
        EVENING: { title: "Mañana de Hoy", prompt: "¿Cuál fue tu primera interacción al despertar?", tip: "Cierra los ojos. ¿A qué olía el café?", icon: "sun" },
        MORNING: { title: "Mañana de Ayer", prompt: "Viaja mentalmente a ayer por la mañana.", tip: "Recuperación diferida.", icon: "sun" }
    },
    // ... (Copiar el resto de prompts del archivo anterior)
    [AppStep.MID_MORNING_RECALL]: {
        EVENING: { title: "Media Mañana", prompt: "¿Qué sucedió entre el desayuno y el almuerzo?", tip: "Orden cronológico.", icon: "coffee" },
        MORNING: { title: "Media Mañana (Ayer)", prompt: "¿Qué hiciste ayer antes de comer?", tip: "Visualiza el lugar.", icon: "coffee" }
    },
    [AppStep.AFTERNOON_RECALL]: {
        EVENING: { title: "Almuerzo", prompt: "¿Qué comiste hoy exactamente?", tip: "Reconstruye sabores.", icon: "utensils" },
        MORNING: { title: "Almuerzo (Ayer)", prompt: "¿Con quién comiste ayer?", tip: "Detalles sociales.", icon: "utensils" }
    },
    [AppStep.MID_AFTERNOON_RECALL]: {
        EVENING: { title: "Media Tarde", prompt: "¿Qué pasó después de comer?", tip: "Nivel de energía.", icon: "cloud-rain" },
        MORNING: { title: "Tarde (Ayer)", prompt: "¿Cómo terminó tu tarde ayer?", tip: "Eventos secuenciales.", icon: "cloud-rain" }
    },
    [AppStep.SPATIAL_RECALL]: {
        EVENING: { title: "Espacial", prompt: "Describe un trayecto de hoy.", tip: "Vista 3D.", icon: "map-pin" },
        MORNING: { title: "Espacial (Ayer)", prompt: "Describe un camino de ayer.", tip: "Navegación mental.", icon: "map-pin" }
    },
    [AppStep.ANECDOTE]: {
        EVENING: { title: "Anécdota", prompt: "Un momento destacable de hoy.", tip: "Memoria emocional.", icon: "sparkles" },
        MORNING: { title: "Anécdota (Ayer)", prompt: "Algo curioso de ayer.", tip: "Detalles únicos.", icon: "sparkles" }
    }
};

export const TIPS_DB = {
    MORNING: ["Visualización Creativa", "Fichero Mental", "Observación Consciente"],
    EVENING: ["Reconstrucción Inversa", "Gratitud Visual", "Palacio de la Memoria"],
    RECOVERY: ["Atención Voluntaria", "Asociaciones Absurdas"]
};
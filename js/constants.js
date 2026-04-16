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
    HISTORY: 'HISTORY',
    GUIDED_COGNITIVE_ACTIVATION: 'GUIDED_COGNITIVE_ACTIVATION',
    GUIDED_QUESTION: 'GUIDED_QUESTION'
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
    { id: '11', emoji: '🍎', name: 'Manzana' },
    { id: '12', emoji: '⚽', name: 'Balón' },
    { id: '13', emoji: '🕶️', name: 'Gafas' },
    { id: '14', emoji: '🎧', name: 'Auriculares' },
    { id: '15', emoji: '📷', name: 'Cámara' },
    { id: '16', emoji: '🕯️', name: 'Vela' },
    { id: '17', emoji: '🔦', name: 'Linterna' },
    { id: '18', emoji: '🎒', name: 'Mochila' },
    { id: '19', emoji: '🥪', name: 'Sándwich' },
    { id: '20', emoji: '🥤', name: 'Refresco' },
    { id: '21', emoji: '🛹', name: 'Skate' },
    { id: '22', emoji: '🎨', name: 'Paleta' },
    { id: '23', emoji: '🎻', name: 'Violín' },
    { id: '24', emoji: '🔭', name: 'Telescopio' },
    { id: '25', emoji: '🧭', name: 'Brújula' },
    { id: '26', emoji: '💎', name: 'Diamante' },
    { id: '27', emoji: '🍄', name: 'Seta' },
    { id: '28', emoji: '🐚', name: 'Concha' },
    { id: '29', emoji: '🥨', name: 'Pretzel' },
    { id: '30', emoji: '🍩', name: 'Donut' }
];

export const PROMPTS = {
    [AppStep.MORNING_RECALL]: {
        EVENING: { title: "Mañana de Hoy", prompt: "¿Cuál fue tu primera interacción al despertar?", tip: "Cierra los ojos. ¿A qué olía el café?", icon: "sun" },
        MORNING: { title: "Mañana de Ayer", prompt: "Viaja mentalmente a ayer por la mañana.", tip: "Recuperación diferida.", icon: "sun" }
    },

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

// Preguntas guiadas para el modo offline
export const GUIDED_PROMPTS_POOL = {
    SENSORY: [
        { title: "Vista", prompt: "Observa un objeto cercano con detalle. ¿Qué texturas, colores y sombras logras percibir sin nombrarlo?", icon: "eye" },
        { title: "Oído", prompt: "Cierra los ojos un momento y concéntrate en el sonido más distante que puedas captar. Descúbrelo.", icon: "ear" },
        { title: "Gusto", prompt: "Busca en tu memoria gustativa el último sabor complejo que experimentaste (café, especias, pan). Descríbelo mentalmente.", icon: "coffee" },
        { title: "Térmica", prompt: "Percibe la temperatura en tus manos y tu frente. ¿Qué diferencias notas entra ambas sensaciones?", icon: "thermometer" }
    ],
    GENERAL: [
        { title: "Reflexión", prompt: "Si el día de hoy fuera un capítulo de un libro, ¿qué título sugerente le pondrías?", icon: "book" },
        { title: "Emoción", prompt: "Piensa en el momento más calmado del día de ayer o de hoy. ¿Dónde estabas y cómo se sentía cuerpo?", icon: "wind" },
        { title: "Aprendizaje", prompt: "Visualiza un pequeño obstáculo reciente. ¿De qué otra forma se podría haber rodeado hoy?", icon: "lightbulb" },
        { title: "Gratitud", prompt: "Trae a tu mente una interacción sencilla que te hizo sentir bien, por pequeña que fuera.", icon: "heart" }
    ],
    PARTICULAR: [
        { title: "Detalle", prompt: "Recuerda una frase o palabra curiosa que alguien haya pronunciado en tu presencia últimamente.", icon: "message-circle" },
        { title: "Pausa", prompt: "Toma aire. Identifica un esfuerzo físico que hayas realizado y agradece silenciosamente a tus músculos.", icon: "activity" },
        { title: "Curiosidad", prompt: "¿Había alguna forma, sombra o patrón de luz interesante en alguna pared hoy?", icon: "sun" }
    ]
};
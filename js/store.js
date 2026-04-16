// js/store.js
import { AppStep, MEMORY_ITEMS_POOL, GUIDED_PROMPTS_POOL } from './constants.js';

const STORAGE_KEY = 'neurolog_sessions_v2';
const generateId = () => crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).substr(2);

// Singleton Store
export const store = {
    state: {
        currentStep: AppStep.WELCOME,
        sessionMode: 'EVENING',
        isDarkMode: false,
        isPaused: false,
        isSyncing: false,
        timer: 0,
        timerInterval: null,

        // Offline Guided Mode
        isGuidedMode: false,
        guidedSessionsCompleted: 0,
        guidedSessionQuestions: [],
        guidedCurrentQuestionIndex: 0,

        // Calendario
        calendarDate: new Date(), // Fecha que se está viendo
        selectedFilterDate: null, // Fecha seleccionada para filtrar historial

        currentEntry: {
            id: null, timestamp: 0, date: '', sessionType: 'EVENING',
            morning: '', midMorning: '', afternoon: '', midAfternoon: '',
            spatial: '', anecdote: '', memoryScore: 0, feedback: '', synced: false
        },

        targetItems: [],
        selectedItems: [],
        history: []
    },

    listeners: [],

    init() {
        try {
            const savedHistory = localStorage.getItem(STORAGE_KEY);
            if (savedHistory) this.state.history = JSON.parse(savedHistory);
        } catch (e) {
            console.error("Error cargando historial:", e);
            this.state.history = [];
        }

        try {
            const guidedStats = localStorage.getItem('neurolog_guided_stats');
            if (guidedStats) this.state.guidedSessionsCompleted = parseInt(guidedStats) || 0;
        } catch (e) {}

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            this.state.isDarkMode = true;
            document.body.classList.add('dark');
        }
    },

    subscribe(fn) { this.listeners.push(fn); },
    notify() { this.listeners.forEach(fn => fn(this.state)); },

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notify();
    },

    setStep(step) {
        this.state.currentStep = step;
        this.notify();
    },

    toggleTheme() {
        const switchTheme = () => {
            this.state.isDarkMode = !this.state.isDarkMode;
            document.body.classList.toggle('dark', this.state.isDarkMode);
            localStorage.setItem('theme', this.state.isDarkMode ? 'dark' : 'light');
            this.notify();
        };

        if (!document.startViewTransition) {
            switchTheme();
        } else {
            document.startViewTransition(switchTheme);
        }
    },

    startSession(mode) {
        this.state.sessionMode = mode;
        this.state.currentEntry = {
            id: generateId(),
            timestamp: Date.now(),
            sessionType: mode,
            date: new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            synced: false
        };

        // Auto tema
        if (mode === 'EVENING' && !this.state.isDarkMode) this.toggleTheme();
        if (mode === 'MORNING' && this.state.isDarkMode) this.toggleTheme();

        // Items aleatorios
        this.state.targetItems = [...MEMORY_ITEMS_POOL].sort(() => 0.5 - Math.random()).slice(0, 5);
        this.state.selectedItems = [];

        this.setStep(AppStep.MORNING_RECALL);
    },

    startGuidedSession() {
        this.state.isGuidedMode = true;
        this.state.sessionMode = 'GUIDED';
        this.state.currentEntry = { id: generateId(), timestamp: Date.now(), sessionType: 'GUIDED', synced: false };
        
        // Auto tema guiado
        if (!this.state.isDarkMode) this.toggleTheme();

        // Items aleatorios para la fase de Memory Encoding reutilizada
        this.state.targetItems = [...MEMORY_ITEMS_POOL].sort(() => 0.5 - Math.random()).slice(0, 5);
        this.state.selectedItems = [];

        // Generación de preguntas basadas en pseudo-semilla de sesión
        const timeSeed = new Date().getTime();
        const pickRandom = (arr, seedMod) => arr[Math.floor(Math.abs(Math.sin(timeSeed * seedMod)) * arr.length)];
        
        this.state.guidedSessionQuestions = [
            pickRandom(GUIDED_PROMPTS_POOL.SENSORY, 1),
            pickRandom(GUIDED_PROMPTS_POOL.GENERAL, 2),
            pickRandom(GUIDED_PROMPTS_POOL.PARTICULAR, 3)
        ];
        this.state.guidedCurrentQuestionIndex = 0;
        
        this.setStep(AppStep.GUIDED_COGNITIVE_ACTIVATION);
    },

    finishGuidedSession() {
        this.state.guidedSessionsCompleted++;
        localStorage.setItem('neurolog_guided_stats', this.state.guidedSessionsCompleted.toString());
        this.state.isGuidedMode = false;
        this.setStep(AppStep.WELCOME);
    },

    // Calendario Logica
    prevMonth() {
        const d = this.state.calendarDate;
        this.state.calendarDate = new Date(d.getFullYear(), d.getMonth() - 1, 1);
        this.notify();
    },
    nextMonth() {
        const d = this.state.calendarDate;
        this.state.calendarDate = new Date(d.getFullYear(), d.getMonth() + 1, 1);
        this.notify();
    },
    selectDate(dateStr) { // Formato YYYY-MM-DD
        this.state.selectedFilterDate = (this.state.selectedFilterDate === dateStr) ? null : dateStr;
        this.notify();
    },

    saveSession(feedback, score) {
        this.state.currentEntry.feedback = feedback;
        this.state.currentEntry.memoryScore = score;
        this.state.history.unshift({ ...this.state.currentEntry });
        this.persist();
    },

    updateHistory(newHistory) {
        this.state.history = newHistory;
        this.persist();
        this.notify();
    },

    persist() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state.history));
    }
};

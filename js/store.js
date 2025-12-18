// js/store.js
import { AppStep, MEMORY_ITEMS_POOL } from './constants.js';

const STORAGE_KEY = 'neurolog_sessions_v2';
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

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
        const savedHistory = localStorage.getItem(STORAGE_KEY);
        if (savedHistory) this.state.history = JSON.parse(savedHistory);
        
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
        this.state.isDarkMode = !this.state.isDarkMode;
        document.body.classList.toggle('dark', this.state.isDarkMode);
        localStorage.setItem('theme', this.state.isDarkMode ? 'dark' : 'light');
        this.notify();
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
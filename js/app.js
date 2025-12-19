// js/app.js

// 1. IMPORTACIONES CORRECTAS (Vital para que funcione con Vite/NPM)
import '../css/style.css';
import { createIcons, icons } from 'lucide';
import { store } from './store.js';
import { Render } from './render.js';
import { AppStep, MEMORY_ITEMS_POOL, TIPS_DB } from './constants.js';
import { DriveService } from './driveService.js';

class App {
    constructor() {

        this.container = document.getElementById('app-container');
        store.subscribe(this.render.bind(this));

        // 1. Init Store siempre funciona (es local)
        store.init();

        // 2. Drive Service puede fallar offline, lo envolvemos
        try {
            DriveService.init((success) => console.log("Drive API Loaded:", success));
        } catch (e) {
            console.warn("Drive API no disponible offline");
        }

        // 3. Eventos globales con verificación de existencia
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) themeBtn.addEventListener('click', () => store.toggleTheme());


        // --- LÓGICA DEL BOTÓN DE DONACIÓN (NUEVO) ---
        const donateBtn = document.getElementById('donate-btn');
        const donateModal = document.getElementById('donate-modal');
        const closeDonate = document.getElementById('close-donate');
        const donateContent = document.getElementById('donate-content');

        window.addEventListener('online', () => this.updateGlobalStatus());
        window.addEventListener('offline', () => this.updateGlobalStatus());

        // 4. Render inicial
        this.render(store.state);
        this.updateGlobalStatus();

        // 5. Iconos con protección
        try {
            createIcons({ icons });
        } catch (e) { console.log("Iconos no cargados offline"); }

        if (donateBtn && donateModal) {
            // Abrir
            donateBtn.addEventListener('click', () => {
                donateModal.classList.remove('hidden');
                // Pequeño timeout para permitir la animación de opacidad
                setTimeout(() => {
                    donateModal.classList.remove('opacity-0');
                    donateContent.classList.remove('scale-95');
                    donateContent.classList.add('scale-100');
                }, 10);
            });

            // Función Cerrar
            const closeModal = () => {
                donateModal.classList.add('opacity-0');
                donateContent.classList.remove('scale-100');
                donateContent.classList.add('scale-95');
                setTimeout(() => donateModal.classList.add('hidden'), 300);
            };

            // Cerrar con botón X
            if (closeDonate) closeDonate.addEventListener('click', closeModal);

            // Cerrar clicando fuera (overlay)
            donateModal.addEventListener('click', (e) => {
                if (e.target === donateModal) closeModal();
            });
        }



        // Render inicial
        this.render(store.state);
        this.updateGlobalStatus();

        createIcons({ icons });
    }

    // Nueva función inteligente de estado
    updateGlobalStatus() {
        const el = document.getElementById('status-indicator');
        const txt = document.getElementById('status-text');
        const iconContainer = el.querySelector('i') || el; // Fallback por si acaso

        if (!el || !txt) return;

        const isOnline = navigator.onLine;
        const isSyncing = store.state.isSyncing;
        // Revisamos si hay alguna entrada en el historial que tenga synced: false
        const hasPendingData = store.state.history.some(entry => !entry.synced);

        // Limpiar clases de colores anteriores
        el.className = "fixed top-6 left-6 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full shadow-lg text-xs font-bold border transition-all duration-300 ";

        // Lógica de estados
        if (!isOnline) {
            // Caso 1: Sin Internet (Modo Montaña)
            el.className += "bg-stone-200 border-stone-300 text-stone-500";
            txt.innerText = "Offline (Guardado local)";
            // Cambiamos el icono a wifi-off (necesitas re-renderizar iconos al final)
            el.innerHTML = `<i data-lucide="wifi-off" class="w-4 h-4"></i> <span id="status-text">${txt.innerText}</span>`;
        }
        else if (isSyncing) {
            // Caso 2: Subiendo datos
            el.className += "bg-blue-50 border-blue-200 text-blue-600";
            el.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> <span id="status-text">Sincronizando...</span>`;
        }
        else if (hasPendingData) {
            // Caso 3: Con Internet pero hay datos sin guardar en la nube
            el.className += "bg-amber-50 border-amber-200 text-amber-600";
            el.innerHTML = `<i data-lucide="cloud-off" class="w-4 h-4"></i> <span id="status-text">Cambios sin subir</span>`;
        }
        else {
            // Caso 4: Todo perfecto y sincronizado
            el.className += "bg-emerald-50 border-emerald-200 text-emerald-600";
            el.innerHTML = `<i data-lucide="wifi" class="w-4 h-4"></i>`;
        }

        // Importante: Refrescar iconos tras cambiar el innerHTML
        import('lucide').then(lucide => lucide.createIcons({ icons: lucide.icons }));
    }

    // Navegación
    startSession(mode) {
        console.log("Iniciando sesión:", mode); // Debug
        store.startSession(mode);
        this.startTimer(120);
        // Forzar scroll arriba en móviles al cambiar de vista
        window.scrollTo(0, 0);
    }

    goHome() { store.setStep(AppStep.WELCOME); }
    goToHistory() { store.setStep(AppStep.HISTORY); }

    // Timer
    // Reemplaza toda la función startTimer con esto:
    startTimer(seconds) {
        // Limpiar intervalo anterior si existe
        if (store.state.timerInterval) clearInterval(store.state.timerInterval);

        // Actualizamos el estado inicial SIN disparar renderizado (mutación directa)
        store.state.timer = seconds;

        // Actualizar visualmente el timer inicial si existe el elemento
        const updateVisualTimer = (val) => {
            const el = document.getElementById('timer-display');
            if (el) {
                const m = Math.floor(val / 60);
                const s = val % 60;
                el.innerText = `${m}:${s < 10 ? '0' + s : s}`;
                if (val < 10) {
                    el.classList.add('text-red-500', 'animate-pulse');
                } else {
                    el.classList.remove('text-red-500', 'animate-pulse');
                }
            }
        };

        // Pintar el tiempo inicial
        updateVisualTimer(seconds);

        const tick = () => {
            if (store.state.isPaused) return;

            let t = store.state.timer - 1;

            // --- AQUÍ ESTABA EL ERROR ---
            // Antes usábamos store.setState({ timer: t }), lo que redibujaba TODO.
            // Ahora actualizamos la variable en silencio:
            store.state.timer = t;

            // Y actualizamos SOLO el numerito en el HTML:
            updateVisualTimer(t);

            if (t <= 0) {
                clearInterval(store.state.timerInterval);
                this.nextStep();
            }
        };

        store.state.timerInterval = setInterval(tick, 1000);
    }

    togglePause() { store.setState({ isPaused: !store.state.isPaused }); }

    updateField(field, value) {
        store.state.currentEntry[field] = value;
    }

    nextStep() {
        const current = store.state.currentStep;
        let next = AppStep.WELCOME;
        let time = 120;

        const steps = [
            AppStep.MORNING_RECALL, AppStep.MID_MORNING_RECALL, AppStep.MEMORY_ENCODING,
            AppStep.AFTERNOON_RECALL, AppStep.MID_AFTERNOON_RECALL, AppStep.SPATIAL_RECALL,
            AppStep.ANECDOTE, AppStep.MEMORY_RETRIEVAL, AppStep.ANALYSIS, AppStep.COMPLETED
        ];

        const idx = steps.indexOf(current);
        if (idx !== -1 && idx < steps.length - 1) next = steps[idx + 1];

        if (next === AppStep.MEMORY_ENCODING) time = 30;
        if (next === AppStep.MEMORY_RETRIEVAL) time = 0;
        if (next === AppStep.ANALYSIS) {
            this.analyzeAndFinish();
            return;
        }

        store.setStep(next);
        if (time > 0) this.startTimer(time);
        else clearInterval(store.state.timerInterval);
        window.scrollTo(0, 0);
    }

    calendarNav(dir) {
        if (dir === 1) store.nextMonth();
        else store.prevMonth();
    }
    handleDateSelect(dateStr) { store.selectDate(dateStr); }

    async handleDriveSync() {
        if (!navigator.onLine) { alert("Sin conexión"); return; }
        store.setState({ isSyncing: true });
        try {
            await DriveService.signIn();
            const newData = await DriveService.sync(store.state.history);
            store.updateHistory(newData);
            alert("Sincronización completada");
        } catch (e) {
            console.error(e);
            alert("Error al sincronizar o login cancelado.");
        } finally {
            store.setState({ isSyncing: false });
        }
    }

    toggleMemoryItem(id) {
        const s = store.state.selectedItems;
        const idx = s.indexOf(id);
        if (idx > -1) s.splice(idx, 1);
        else s.push(id);
        store.setState({ selectedItems: [...s] });
    }

    async analyzeAndFinish() {
        store.setStep(AppStep.ANALYSIS);

        const target = store.state.targetItems.map(i => i.id);
        const selected = store.state.selectedItems;
        const correct = selected.filter(id => target.includes(id)).length;
        const wrong = selected.length - correct;
        const score = Math.max(0, correct - wrong);

        await new Promise(r => setTimeout(r, 1500));

        const pool = score >= 3
            ? (store.state.sessionMode === 'MORNING' ? TIPS_DB.MORNING : TIPS_DB.EVENING)
            : TIPS_DB.RECOVERY;
        const tip = pool[Math.floor(Math.random() * pool.length)];
        const feedback = `Puntuación: ${score}/5. Consejo para mañana: ${tip}.`;

        store.saveSession(feedback, score);
        store.setStep(AppStep.COMPLETED);
    }



    // 5. FUNCIONES DE IMPORTAR / EXPORTAR
    exportLocalData() {
        const dataStr = JSON.stringify(store.state.history, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `neurolog-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    }

    importLocalData(file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const parsed = JSON.parse(e.target.result);
                if (Array.isArray(parsed)) {
                    // Mezclar con lo existente
                    const currentMap = new Map(store.state.history.map(i => [i.id, i]));
                    let added = 0;
                    parsed.forEach(item => {
                        if (!currentMap.has(item.id)) {
                            currentMap.set(item.id, item);
                            added++;
                        }
                    });
                    const merged = Array.from(currentMap.values()).sort((a, b) => b.timestamp - a.timestamp);

                    store.updateHistory(merged);
                    alert(`Se importaron ${added} entradas correctamente.`);
                } else {
                    alert("El formato del archivo no es válido.");
                }
            } catch (err) {
                console.error(err);
                alert("Error al leer el archivo.");
            }
        };
        reader.readAsText(file);
    }





    render(state) {
        let html = '';
        const step = state.currentStep;

        if (step === AppStep.WELCOME) html = Render.welcome(state);
        else if (step === AppStep.MEMORY_ENCODING) html = Render.encoding(state);
        else if (step === AppStep.MEMORY_RETRIEVAL) {
            html = Render.retrieval(state);
            setTimeout(() => this.renderRetrievalGrid(), 0);
        }
        else if (step === AppStep.HISTORY) html = Render.history(state);
        else if (step === AppStep.ANALYSIS) html = Render.analysis();
        else if (step === AppStep.COMPLETED) html = Render.completed(state);
        else html = Render.stepForm(state);

        this.container.innerHTML = html;
        // 3. REFRESCAR ICONOS DESPUES DE RENDERIZAR
        createIcons({ icons }); // <--- CAMBIO IMPORTANTE
    }

    renderRetrievalGrid() {
        const container = document.getElementById('retrieval-container');
        if (!container) return;

        const { isDarkMode, selectedItems } = store.state;
        const c = isDarkMode ? { bg: 'bg-stone-800', txt: 'text-white', sel: 'bg-stone-600 ring-2 ring-stone-400' } : { bg: 'bg-white', txt: 'text-stone-800', sel: 'bg-stone-800 text-white' };

        // Aquí deberías tener acceso a MEMORY_ITEMS_POOL (asegúrate que esté importado)
        const grid = MEMORY_ITEMS_POOL.map(item => {
            const isSel = selectedItems.includes(item.id);
            return `
            <button data-id="${item.id}" class="p-4 rounded-xl border shadow-sm flex flex-col items-center transition-all ${isSel ? c.sel : c.bg + ' ' + c.txt}">
                <span class="text-3xl mb-2 pointer-events-none">${item.emoji}</span>
                <span class="text-xs font-bold uppercase pointer-events-none">${item.name}</span>
            </button>`;
        }).join('');

        container.innerHTML = `
            <h2 class="text-2xl font-bold text-center mb-6 ${isDarkMode ? 'text-white' : 'text-stone-800'}">Recuperación</h2>
            <div class="grid grid-cols-4 gap-3 mb-6">${grid}</div>
            <button id="btn-finish" class="w-full py-4 rounded-xl font-bold bg-amber-600 text-white shadow-lg">Finalizar</button>
        `;

        container.querySelectorAll('button[data-id]').forEach(b => {
            b.onclick = () => this.toggleMemoryItem(b.dataset.id);
        });
        document.getElementById('btn-finish').onclick = () => this.analyzeAndFinish();
    }
}

// 4. EXPONER LA APP A WINDOW (Crucial para que los onclick="" del HTML funcionen)
window.app = new App();
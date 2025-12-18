import { AppStep, PROGRESS_MAP, PROMPTS } from './constants.js';

const getClasses = (isDark) => ({
    bgMain: isDark ? 'bg-stone-950' : 'bg-[#E7E5E4]',
    bgCard: isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200',
    textMain: isDark ? 'text-stone-200' : 'text-stone-800',
    textSub: isDark ? 'text-stone-400' : 'text-stone-600',
    btnPrimary: isDark ? 'bg-stone-700 hover:bg-stone-600 text-white' : 'bg-stone-800 hover:bg-stone-700 text-[#FAF9F6]',
    btnSecondary: isDark ? 'bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-700' : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50',
    border: isDark ? 'border-stone-800' : 'border-stone-200'
});

// 1. BARRA DE PROGRESO MEJORADA
const progressBar = (currentStep, isDark) => {
    if ([AppStep.WELCOME, AppStep.HISTORY, AppStep.COMPLETED, AppStep.ANALYSIS].includes(currentStep)) return '';
    
    const percent = PROGRESS_MAP[currentStep] || 0;
    
    return `
    <div class="w-full mb-8 px-1">
        <div class="flex justify-between text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-stone-500' : 'text-stone-500'}">
            <span>Inicio</span>
            <span>Progreso: ${percent}%</span>
            <span>Fin</span>
        </div>
        <div class="h-3 rounded-full overflow-hidden shadow-inner ${isDark ? 'bg-stone-800' : 'bg-stone-300'}">
            <div class="h-full transition-all duration-700 ease-in-out relative ${isDark ? 'bg-indigo-500' : 'bg-stone-600'}" style="width: ${percent}%">
                 <div class="absolute top-0 right-0 bottom-0 w-full bg-gradient-to-l from-white/20 to-transparent"></div>
            </div>
        </div>
    </div>`;
};

const calendar = (history, currentDate, selectedDateStr, isDark) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const monthName = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

    const sessionsByDay = {};
    history.forEach(h => {
        const d = new Date(h.timestamp);
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; 
        if (!sessionsByDay[key]) sessionsByDay[key] = [];
        sessionsByDay[key].push(h);
    });

    let daysHtml = '';
    for (let i = 0; i < firstDay; i++) daysHtml += `<div></div>`;

    for (let d = 1; d <= daysInMonth; d++) {
        const key = `${year}-${month}-${d}`;
        const sessions = sessionsByDay[key] || [];
        const hasMorning = sessions.some(s => s.sessionType === 'MORNING');
        const hasEvening = sessions.some(s => s.sessionType === 'EVENING');
        
        // Comparación simple de string para selección
        // Nota: Asegúrate de que selectedDateStr venga en formato "YYYY-M-D" (sin ceros iniciales si usas getMonth/getDate directos)
        const isSelected = selectedDateStr === key;
        
        const btnClass = isSelected 
            ? (isDark ? 'bg-stone-700 text-white shadow-lg scale-105 z-10' : 'bg-stone-800 text-white shadow-lg scale-105 z-10')
            : (isDark ? 'bg-stone-900 text-stone-400 hover:bg-stone-800' : 'bg-white text-stone-600 hover:bg-stone-50');

        daysHtml += `
        <button onclick="window.app.handleDateSelect('${year}-${month}-${d}')" 
            class="h-12 sm:h-14 rounded-xl border ${isDark ? 'border-stone-800' : 'border-stone-100'} flex flex-col items-center justify-center relative transition-all ${btnClass}">
            <span class="text-xs sm:text-sm font-bold">${d}</span>
            <div class="flex gap-1 mt-1">
                ${hasMorning ? `<div class="w-1.5 h-1.5 rounded-full bg-amber-400"></div>` : ''}
                ${hasEvening ? `<div class="w-1.5 h-1.5 rounded-full ${isDark ? 'bg-indigo-400' : 'bg-indigo-600'}"></div>` : ''}
            </div>
        </button>`;
    }

    return `
    <div class="p-4 sm:p-6 rounded-2xl border mb-6 ${isDark ? 'bg-stone-950 border-stone-800' : 'bg-[#FAF9F6] border-stone-200'}">
        <div class="flex justify-between items-center mb-4">
            <button onclick="window.app.calendarNav(-1)" class="p-2 rounded-full hover:bg-black/10"><i data-lucide="chevron-left"></i></button>
            <h3 class="text-base sm:text-lg font-bold capitalize ${isDark ? 'text-stone-200' : 'text-stone-800'}">${monthName}</h3>
            <button onclick="window.app.calendarNav(1)" class="p-2 rounded-full hover:bg-black/10"><i data-lucide="chevron-right"></i></button>
        </div>
        <div class="grid grid-cols-7 gap-2 text-center text-[10px] sm:text-xs font-bold opacity-50 mb-2">
            <div>D</div><div>L</div><div>M</div><div>M</div><div>J</div><div>V</div><div>S</div>
        </div>
        <div class="grid grid-cols-7 gap-1 sm:gap-2">
            ${daysHtml}
        </div>
    </div>`;
};

const historyCard = (entry, isDark) => {
    const c = getClasses(isDark);
    const icon = entry.sessionType === 'MORNING' ? 'sun' : 'moon';
    const typeColor = entry.sessionType === 'MORNING' ? 'text-amber-500' : 'text-indigo-500';
    
    const sections = [
        { label: 'Mañana', val: entry.morning, icon: 'sun' },
        { label: 'Media M.', val: entry.midMorning, icon: 'coffee' },
        { label: 'Tarde', val: entry.afternoon, icon: 'utensils' },
        { label: 'Media T.', val: entry.midAfternoon, icon: 'cloud-rain' },
        { label: 'Espacial', val: entry.spatial, icon: 'map-pin' },
        { label: 'Anécdota', val: entry.anecdote, icon: 'sparkles' }
    ].filter(s => s.val).map(s => `
        <div class="mb-3 break-words">
            <h4 class="text-xs font-bold uppercase tracking-wider opacity-60 mb-1 flex items-center gap-1">
                <i data-lucide="${s.icon}" class="w-3 h-3"></i> ${s.label}
            </h4>
            <p class="text-sm border-l-2 pl-3 italic ${isDark ? 'border-stone-700 text-stone-400' : 'border-stone-300 text-stone-700'}">${s.val}</p>
        </div>
    `).join('');

    return `
    <div class="rounded-xl border shadow-sm mb-6 overflow-hidden fade-in ${c.bgCard}">
        <div class="p-4 border-b flex justify-between items-center ${isDark ? 'bg-stone-950 border-stone-800' : 'bg-stone-100 border-stone-200'}">
            <div class="flex items-center gap-3">
                <div class="p-1.5 rounded-full bg-opacity-20 ${entry.sessionType === 'MORNING' ? 'bg-amber-500' : 'bg-indigo-500'} ${typeColor}">
                    <i data-lucide="${icon}" class="w-4 h-4"></i>
                </div>
                <div>
                    <div class="font-bold text-sm ${c.textMain}">${entry.date}</div>
                    <div class="text-xs opacity-60">${new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
            </div>
            <div class="flex items-center gap-2">
                 ${!entry.synced ? '<i data-lucide="cloud-off" class="w-4 h-4 text-orange-500" title="No sincronizado"></i>' : '<i data-lucide="check" class="w-4 h-4 text-green-500 opacity-50"></i>'}
                <span class="text-xs font-bold border px-2 py-1 rounded-full ${c.border}">Score: ${entry.memoryScore}/5</span>
            </div>
        </div>
        <div class="p-5">
            <div class="grid md:grid-cols-2 gap-4">
                ${sections}
            </div>
            ${entry.feedback ? `
                <div class="mt-4 p-3 rounded-lg text-sm flex gap-3 ${isDark ? 'bg-amber-900/20 text-amber-200' : 'bg-amber-50 text-stone-700'}">
                    <i data-lucide="brain" class="w-5 h-5 flex-shrink-0 mt-1"></i>
                    <div>${entry.feedback}</div>
                </div>
            ` : ''}
        </div>
    </div>`;
};

export const Render = {
    welcome: (state) => {
        const c = getClasses(state.isDarkMode);
        // 5. BOTONES IMPORTAR/EXPORTAR AGREGADOS
        return `
        <div class="text-center max-w-lg mx-auto fade-in pt-6 pb-20">
            <div class="p-6 rounded-full inline-block mb-4 shadow-inner border-4 ${state.isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-[#E7E5E4] border-white'}">
                <i data-lucide="brain" class="w-16 h-16 ${state.isDarkMode ? 'text-stone-400' : 'text-stone-700'}"></i>
            </div>
            <h1 class="text-5xl font-bold mb-8 font-serif ${c.textMain}">NeuroLog</h1>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <button onclick="window.app.startSession('MORNING')" class="group border-2 p-6 rounded-xl text-left hover:shadow-md transition-all ${c.bgCard} hover:border-amber-400">
                    <div class="flex items-center gap-2 mb-2"><i data-lucide="sun" class="text-amber-500"></i> <span class="font-bold">Matutina</span></div>
                    <p class="text-xs ${c.textSub}">Reflexión de ayer para activar hoy.</p>
                </button>
                <button onclick="window.app.startSession('EVENING')" class="group border-2 p-6 rounded-xl text-left hover:shadow-md transition-all ${c.bgCard} hover:border-indigo-400">
                    <div class="flex items-center gap-2 mb-2"><i data-lucide="moon" class="text-indigo-500"></i> <span class="font-bold">Nocturna</span></div>
                    <p class="text-xs ${c.textSub}">Consolidación de hoy antes de dormir.</p>
                </button>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                <button onclick="window.app.handleDriveSync()" class="px-5 py-3 rounded-xl border flex items-center justify-center gap-2 font-medium transition-colors ${state.isDarkMode ? 'bg-indigo-900/30 border-indigo-800 text-indigo-200 hover:bg-indigo-900/50' : 'bg-white border-indigo-100 text-indigo-600 hover:bg-indigo-50'}">
                    <i data-lucide="${state.isSyncing ? 'loader-2' : 'cloud'}" class="${state.isSyncing ? 'animate-spin' : ''}"></i> 
                    ${state.isSyncing ? 'Sincronizando...' : 'Google Drive'}
                </button>
                
                <!-- 3. ARREGLADO EL BOTÓN "VER DIARIO" (ahora tiene estilo) -->
                ${state.history.length > 0 ? `
                <button onclick="window.app.goToHistory()" class="px-5 py-3 rounded-xl border font-medium flex items-center justify-center gap-2 transition-colors ${c.btnSecondary}">
                    <i data-lucide="book-open" class="w-4 h-4"></i> Ver Diario
                </button>` : ''}
            </div>

            <!-- 5. BOTONES DE GESTIÓN LOCAL -->
            <div class="flex gap-4 justify-center text-sm">
                <button onclick="window.app.exportLocalData()" class="flex items-center gap-1 opacity-60 hover:opacity-100 ${c.textMain}">
                    <i data-lucide="download" class="w-4 h-4"></i> Guardar Copia
                </button>
                <button onclick="document.getElementById('import-file').click()" class="flex items-center gap-1 opacity-60 hover:opacity-100 ${c.textMain}">
                    <i data-lucide="upload" class="w-4 h-4"></i> Cargar Copia
                </button>
                <input type="file" id="import-file" class="hidden" accept=".json" onchange="window.app.importLocalData(this.files[0])">
            </div>
        </div>`;
    },

    stepForm: (state) => {
        const c = getClasses(state.isDarkMode);
        const fields = {
            [AppStep.MORNING_RECALL]: 'morning', [AppStep.MID_MORNING_RECALL]: 'midMorning',
            [AppStep.AFTERNOON_RECALL]: 'afternoon', [AppStep.MID_AFTERNOON_RECALL]: 'midAfternoon',
            [AppStep.SPATIAL_RECALL]: 'spatial', [AppStep.ANECDOTE]: 'anecdote'
        };
        const fieldName = fields[state.currentStep];
        const texts = PROMPTS[state.currentStep][state.sessionMode];
        const val = state.currentEntry[fieldName] || '';

        // 4. AÑADIDO pb-32 (PADDING BOTTOM GRANDE) para evitar solapamiento con el botón pausa
        return `
        ${progressBar(state.currentStep, state.isDarkMode)}
        <div class="max-w-2xl mx-auto fade-in pb-32">
            <div class="flex justify-between items-center mb-6">
                <div class="flex items-center gap-3">
                    <div class="p-2 border rounded-lg ${c.bgCard}"><i data-lucide="${texts.icon}"></i></div>
                    <h2 class="text-2xl font-bold font-serif ${c.textMain}">${texts.title}</h2>
                </div>
                <div id="timer-display" class="font-mono font-bold px-3 py-1 rounded border ${c.textSub}">00:00</div>
            </div>

            <div class="p-6 rounded-xl border mb-6 relative ${c.bgCard}">
                <p class="mb-4 text-lg font-medium ${c.textMain}">${texts.prompt}</p>
                <textarea oninput="window.app.updateField('${fieldName}', this.value)" 
                    class="w-full h-48 p-4 rounded-lg focus:ring-2 focus:outline-none resize-none text-lg ${c.bgMain} ${c.textMain} ${state.isPaused ? 'blur-sm pointer-events-none' : ''}"
                    placeholder="Escribe aquí..." ${state.isPaused ? 'disabled' : ''}>${val}</textarea>
                <div class="mt-4 flex gap-2 text-sm italic opacity-70 ${c.textSub}"><i data-lucide="info" class="w-4 h-4"></i> ${texts.tip}</div>
            </div>

            <button onclick="window.app.nextStep()" class="w-full py-4 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all ${c.btnPrimary}">
                Siguiente <i data-lucide="chevron-right" class="inline ml-1"></i>
            </button>
            
             <button onclick="window.app.togglePause()" class="fixed bottom-8 right-8 p-4 rounded-full shadow-2xl z-50 transition-transform hover:scale-110 ${c.btnPrimary}">
                <i data-lucide="${state.isPaused ? 'play' : 'pause'}" class="w-6 h-6"></i>
            </button>
        </div>`;
    },

    encoding: (state) => {
        const c = getClasses(state.isDarkMode);
        return `
        ${progressBar(state.currentStep, state.isDarkMode)}
        <div class="max-w-xl mx-auto text-center fade-in pt-10 pb-32">
            <h2 class="text-3xl font-bold mb-4 font-serif ${c.textMain}">Memoriza estos objetos</h2>
            <div class="grid grid-cols-5 gap-3 mb-8 ${state.isPaused ? 'blur-sm' : ''}">
                ${state.targetItems.map(i => `<div class="p-3 rounded-xl border shadow flex flex-col items-center justify-center aspect-square ${c.bgCard}"><span class="text-3xl">${i.emoji}</span></div>`).join('')}
            </div>
            <div id="timer-display" class="text-3xl font-bold mb-8 font-mono ${c.textMain}">00:30</div>
            <button onclick="window.app.nextStep()" class="px-8 py-3 rounded-xl font-bold ${c.btnPrimary}">¡Listos!</button>
        </div>`;
    },

    retrieval: (state) => {
        // ... El contenedor vacío que rellena app.js ...
        return `<div id="retrieval-container" class="pb-20"></div>`; 
    },

    history: (state) => {
        const c = getClasses(state.isDarkMode);
        
        let filtered = state.history;
        if (state.selectedFilterDate) {
            filtered = filtered.filter(h => {
                const d = new Date(h.timestamp);
                const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
                return key === state.selectedFilterDate;
            });
        }

        const cards = filtered.length 
            ? filtered.map(h => historyCard(h, state.isDarkMode)).join('') 
            : `<div class="text-center py-10 opacity-50 border-2 border-dashed rounded-xl ${c.border}">No hay entradas para esta fecha.</div>`;

        return `
        <div class="max-w-3xl mx-auto fade-in pb-20">
            <div class="flex justify-between items-center mb-6">
                <button onclick="window.app.goHome()" class="p-2 rounded-full hover:bg-black/5 flex items-center gap-2 ${c.textMain}">
                    <i data-lucide="arrow-left"></i> Volver
                </button>
                <h2 class="text-2xl font-bold font-serif ${c.textMain}">Diario</h2>
                <div class="flex gap-2">
                    <button onclick="window.app.exportLocalData()" class="p-2 rounded-full border ${c.bgCard}" title="Descargar"><i data-lucide="download" class="w-5 h-5"></i></button>
                    <button onclick="window.app.handleDriveSync()" class="p-2 rounded-full border ${c.bgCard} ${state.isSyncing ? 'animate-spin' : ''}" title="Sync Drive">
                        <i data-lucide="refresh-cw" class="w-5 h-5"></i>
                    </button>
                </div>
            </div>
            
            ${calendar(state.history, state.calendarDate, state.selectedFilterDate, state.isDarkMode)}

            <div class="flex justify-between items-end mb-4">
                <h3 class="font-bold text-lg ${c.textMain}">${state.selectedFilterDate ? 'Entradas del día' : 'Todas las entradas'}</h3>
                ${state.selectedFilterDate ? `<button onclick="window.app.handleDateSelect(null)" class="text-xs underline text-amber-600">Ver todas</button>` : ''}
            </div>

            <!-- 2. MIN-HEIGHT para evitar colapso visual -->
            <div class="space-y-4 min-h-[300px]">
                ${cards}
            </div>
        </div>`;
    },

    analysis: () => `<div class="h-[60vh] flex items-center justify-center"><div class="animate-spin w-12 h-12 border-4 border-amber-500 rounded-full border-t-transparent"></div></div>`,
    
    completed: (state) => {
        const c = getClasses(state.isDarkMode);
        return `
        <div class="max-w-xl mx-auto text-center fade-in pt-10 pb-20">
            <h2 class="text-4xl font-bold font-serif mb-4 ${c.textMain}">¡Completado!</h2>
            <div class="bg-amber-100 text-amber-800 px-4 py-2 rounded-full inline-block font-bold mb-8">Score: ${state.currentEntry.memoryScore}/5</div>
            <div class="text-left p-6 rounded-xl border mb-8 ${c.bgCard}">
                <p class="italic text-lg">${state.currentEntry.feedback}</p>
            </div>
            <div class="flex gap-4">
                <button onclick="location.reload()" class="flex-1 py-3 border rounded-xl ${c.btnSecondary}">Inicio</button>
                <button onclick="window.app.goToHistory()" class="flex-1 py-3 rounded-xl ${c.btnPrimary}">Ver Diario</button>
            </div>
        </div>`;
    }
};
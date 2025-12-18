const Services = {
    // Generador de Feedback (Simulación de IA local)
    generateFeedback: async (entry) => {
        // Simular retraso de red/procesamiento
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const score = entry.memoryScore;
        const isMorning = entry.sessionType === 'MORNING';
        let prefix = "";
        let pool = [];

        if (score === 5) {
            prefix = "**¡Memoria Perfecta!** Tu hipocampo está brillante. ";
            pool = isMorning ? TIPS_DB.MORNING : TIPS_DB.EVENING;
        } else if (score >= 3) {
            prefix = "Buen rendimiento. Has retenido la mayoría. ";
            pool = isMorning ? TIPS_DB.MORNING : TIPS_DB.EVENING;
        } else {
            prefix = "Hoy ha sido un reto. ";
            pool = [...TIPS_DB.RECOVERY];
        }

        const randomTip = pool[Math.floor(Math.random() * pool.length)];
        return `${prefix} Consejo: intenta practicar **${randomTip}**.`;
    },

    // Exportar datos a JSON
    exportData: () => {
        const dataStr = JSON.stringify(store.state.history, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `neurolog-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    },

    // Importar datos desde JSON
    importData: (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const parsed = JSON.parse(e.target.result);
                if (Array.isArray(parsed)) {
                    // Merge simple
                    const currentIds = new Set(store.state.history.map(x => x.id));
                    let added = 0;
                    parsed.forEach(item => {
                        if (!currentIds.has(item.id)) {
                            store.state.history.push(item);
                            added++;
                        }
                    });
                    // Ordenar y guardar
                    store.state.history.sort((a, b) => b.timestamp - a.timestamp);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(store.state.history));
                    alert(`Importados ${added} registros nuevos.`);
                    location.reload(); // Recargar para ver cambios
                }
            } catch (err) {
                alert("Error al leer el archivo.");
            }
        };
        reader.readAsText(file);
    },
    
    // Cálculo de Nivel de Usuario
    calculateLevel: () => {
        const count = store.state.history.length;
        if (count < 5) return "Novato Cognitivo";
        if (count < 15) return "Aprendiz de Mnémosine";
        if (count < 30) return "Arquitecto de Memoria";
        return "Maestro del Recuerdo";
    }
};
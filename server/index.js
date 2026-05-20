const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_PATH = path.join(__dirname, '../data/knowledge.json');

// Función RAG con Scoring para mayor precisión
function getRelevantContext(query) {
    if (!fs.existsSync(DATA_PATH)) {
        return "No hay información disponible. Por favor ejecuta el mock-scraper.";
    }
    
    const knowledge = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    const queryLower = query.toLowerCase();
    const keywords = queryLower.split(' ').filter(w => w.length > 3);

    // Algoritmo de Ranking Simple
    const searchResults = knowledge.map(item => {
        let score = 0;
        
        // Puntaje por contenido
        keywords.forEach(word => {
            if (item.contenido.toLowerCase().includes(word)) score++;
            if (item.categoria.toLowerCase().includes(word)) score += 2; // Categoría pesa más
        });
        
        return { ...item, score };
    });

    // Filtrar los que tengan algo de relevancia y ordenar
    const topMatches = searchResults
        .filter(res => res.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 2);

    if (topMatches.length === 0) return "No se encontró información específica en los manuales de ayuda.";
    
    return topMatches.map(m => `[Categoría: ${m.categoria}]\n${m.contenido}`).join('\n\n');
}

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    console.log(`💬 Cliente pregunta: ${message}`);

    const context = getRelevantContext(message);

    const prompt = `
    Eres un asistente virtual de Adidas Colombia. Responde de forma cordial.
    
    CONTEXTO RECUPERADO:
    """
    ${context}
    """

    REGLA: Usa solo el contexto anterior. Si no está la info, di que no la tienes y sugiere llamar al soporte oficial.
    
    PREGUNTA: ${message}
    `;

    try {
        console.log('🤖 Consultando a Ollama (Modelo: gemma:2b)...');
        const ollamaRes = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'gemma:2b',
                prompt: prompt,
                stream: false
            })
        });

        const data = await ollamaRes.json();
        
        if (data.error) {
            console.error('❌ Error de Ollama:', data.error);
            return res.json({ reply: `Error de la IA: ${data.error}. ¿Ya descargaste el modelo gemma:2b?` });
        }

        if (!data.response) {
            console.error('❌ Respuesta inesperada de Ollama:', data);
            return res.json({ reply: "La IA no devolvió una respuesta válida. Revisa la consola del servidor." });
        }

        console.log('✅ Respuesta generada con éxito.');
        res.json({ reply: data.response });

    } catch (error) {
        console.error('❌ Error de conexión:', error.message);
        res.status(500).json({ reply: "No pude conectarme con Ollama. Asegúrate de que la aplicación esté abierta en tu PC." });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 RAG Server activo en http://localhost:${PORT}`));

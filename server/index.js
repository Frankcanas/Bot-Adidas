const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

const DATA_PATH = path.join(__dirname, '../data/knowledge.json');

function normalize(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function getRelevantContext(query) {

    if (!fs.existsSync(DATA_PATH)) {
        return "";
    }

    const knowledge = JSON.parse(
        fs.readFileSync(DATA_PATH, 'utf8')
    );

    const normalizedQuery = normalize(query);

    let keywords = normalizedQuery
        .split(/\s+/)
        .filter(w => w.length > 2);

    const synonymMap = {
        demora: "envio",
        tarda: "envio",
        llega: "envio",
        entrega: "envio",

        devolver: "devolucion",
        cambio: "devolucion",
        garantia: "devolucion",

        pagar: "pago",
        tarjeta: "pago",
        pse: "pago",

        original: "producto",
        autentico: "producto"
    };

    keywords = keywords.flatMap(word => {
        if (synonymMap[word]) {
            return [word, synonymMap[word]];
        }
        return [word];
    });

    const results = knowledge.map(item => {

        let score = 0;

        const contenido = normalize(item.contenido);
        const categoria = normalize(item.categoria);

        const preguntas = (item.preguntas || [])

        const itemKeywords = (item.keywords || [])
        .map(k => normalize(k))
        .join(" ");

        keywords.forEach(word => {

            if (contenido.includes(word)) {
                score += 1;
            }

            if (categoria.includes(word)) {
                score += 4;
            }

            if (preguntas.includes(word)) {
                score += 3;
            }

            if (itemKeywords.includes(word)) {
                score += 5;
            }

        });

        return {
            ...item,
            score
        };

    });

    const topMatches = results
        .filter(r => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 2);

    return topMatches
        .map(r => r.contenido)
        .join("\n\n");
}

app.post('/api/chat', async (req, res) => {

    const { message } = req.body;

    const context = getRelevantContext(message);

    console.log("📚 Contexto encontrado:");
    console.log(context);

    const prompt = `
Eres un asistente virtual experto en atención al cliente de Adidas Colombia.

Tu personalidad es:
- amable,
- profesional,
- útil,
- conversacional.

INSTRUCCIONES:
- Si el CONTEXTO contiene información útil, úsala para responder.
- Si el CONTEXTO no tiene suficiente información, responde usando tu conocimiento general como asistente de Adidas.
- Nunca digas que eres una IA.
- Nunca menciones el contexto.
- Responde de forma natural y resumida.
- No copies literalmente el texto.
- Mantén respuestas cortas y claras.

CONTEXTO:
${context}

PREGUNTA DEL CLIENTE:
${message}

RESPUESTA:
`;

    try {

        const ollamaRes = await fetch(
            'http://localhost:11434/api/generate',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gemma:2b',
                    prompt,
                    stream: false
                })
            }
        );

        const data = await ollamaRes.json();

        res.json({
            reply: data.response
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            reply: "Error conectando con Ollama."
        });

    }

});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor activo en puerto ${PORT}`);
});
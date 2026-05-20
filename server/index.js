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
    garantiaa: "devolucion",

    pagar: "pago",
    tarjeta: "pago",
    pse: "pago",

    original: "producto",
    autentico: "producto",
    yeezy: "producto", zapatos: "producto", tenis: "producto", calzado: "producto", comprar: "producto",

    cuenta: "cuenta",
    registrarme: "cuenta",
    registro: "cuenta",
    iniciar: "cuenta",
    sesion: "cuenta",
    login: "cuenta",
    acceso: "cuenta",
    registrado: "cuenta",
    registrarse: "cuenta",
    perfil: "cuenta",
    usuario: "cuenta",
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
        .map(p => normalize(p))
        .join(" ");


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
        .slice(0, 1);

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
    Eres un asistente virtual de Adidas Colombia.

    Tu trabajo es responder preguntas de clientes
    sobre:
    - pedidos,
    - envíos,
    - devoluciones,
    - garantías,
    - pagos,
    - cuentas,
    - productos.

    REGLAS IMPORTANTES:
    - Siempre responde como soporte de Adidas.
    - Nunca actúes como cliente.
    - Nunca inventes historias personales.
    - Nunca digas que hiciste pedidos.
    - Usa el MENSAJE ACTUAL como fuente principal, pero apóyate en el contexto.
    - Reformula la información con tus propias palabras.
    - No copies literalmente el contexto.
    - Sé breve, útil y profesional.
    - No saludes en cada respuesta.
    - Mantén coherencia.

    Si el contexto no tiene suficiente información:
    - responde de forma general,
    - pero manteniendo el rol de soporte.
    - no inventes exageradamente.

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

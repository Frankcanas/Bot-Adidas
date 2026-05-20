const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const URLS = [
    'https://www.adidas.co/ayuda/devoluciones/como-hacer-una-devolucion',
    'https://www.adidas.co/ayuda/envio/cuanto-tarda-el-envio',
    'https://www.adidas.co/ayuda/pagos/que-metodos-de-pago-se-aceptan'
];

async function scrape() {
    console.log('🚀 Iniciando scraping de Adidas Colombia...');
    const knowledge = [];

    for (const url of URLS) {
        try {
            console.log(`🔍 Accediendo a: ${url}`);
            const { data } = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            const $ = cheerio.load(data);
            
            // Eliminar elementos innecesarios
            $('script, style, nav, footer, header').remove();
            
            const title = $('h1').first().text().trim() || 'Información de Adidas';
            const content = $('main').text().replace(/\s+/g, ' ').trim();

            knowledge.push({ title, content, url });
            console.log(`✅ Extraído: ${title}`);
        } catch (e) {
            console.log(`❌ Error extrayendo ${url}: ${e.message}`);
        }
    }

    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
    
    const dataPath = path.join(dataDir, 'knowledge.json');
    fs.writeFileSync(dataPath, JSON.stringify(knowledge, null, 2));
    console.log(`\n📦 Scraping completado. ${knowledge.length} fuentes guardadas en /data/knowledge.json`);
}

scrape();

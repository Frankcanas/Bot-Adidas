const fs = require('fs');
const path = require('path');

const mockData = [
    {
        categoria: "Envíos",
        preguntas: ["¿Cuánto tarda el envío?", "¿Cuál es el costo de entrega?"],
        contenido: "En Adidas Colombia, los envíos a ciudades principales (Bogotá, Medellín, Cali) tardan de 2 a 5 días hábiles. Para el resto del país, entre 3 y 10 días. El costo es gratuito por compras superiores a $250.000 COP. Si el pedido es menor, el costo estándar es de $10.000 COP.",
        fuente: "https://www.adidas.co/ayuda/envio"
    },
    {
        categoria: "Devoluciones",
        preguntas: ["¿Cómo devuelvo un producto?", "¿Cuántos días tengo para cambios?"],
        contenido: "Cuentas con 60 días calendario desde la recepción de tu pedido para devoluciones gratuitas. Debes generar una guía en la sección 'Mis Pedidos' y llevar el paquete a un punto Servientrega. Los productos de la línea Yeezy o colaboraciones especiales tienen políticas de devolución de solo 7 días.",
        fuente: "https://www.adidas.co/ayuda/devoluciones"
    },
    {
        categoria: "Pagos",
        preguntas: ["¿Qué medios de pago aceptan?", "¿Puedo pagar con PSE?"],
        contenido: "Aceptamos tarjetas de crédito Visa, Mastercard y American Express. También pagos por PSE, Efecty y pago contra entrega en ciudades seleccionadas. No aceptamos cheques ni transferencias directas fuera de la plataforma oficial.",
        fuente: "https://www.adidas.co/ayuda/pagos"
    },
    {
        categoria: "Productos",
        preguntas: ["¿Son originales?", "¿Dónde se fabrican?"],
        contenido: "Todos nuestros productos vendidos en adidas.co son 100% originales. La mayoría de nuestro calzado se fabrica en Vietnam e Indonesia bajo estrictos estándares de calidad internacional de la marca alemana.",
        fuente: "https://www.adidas.co/productos-info"
    }
];

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

const dataPath = path.join(dataDir, 'knowledge.json');
fs.writeFileSync(dataPath, JSON.stringify(mockData, null, 2));
console.log("✅ Base de datos 'inventada' generada con éxito en /data/knowledge.json");

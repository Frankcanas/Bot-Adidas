
const fs = require('fs');
const path = require('path');

// Base de conocimiento simulada para el MVP
const mockData = [
    {
        id: 1,
        categoria: "Envíos",
        preguntas: [
            "¿Cuánto tarda el envío?",
            "¿Cuándo llega mi pedido?",
            "¿Cuánto demora la entrega?",
            "¿Hacen envíos nacionales?"
        ],
        keywords: [
            "envio",
            "entrega",
            "pedido",
            "demora",
            "tiempo",
            "domicilio"
        ],
        contenido: `
En Adidas Colombia los envíos a ciudades principales como Bogotá,
Medellín y Cali tardan entre 2 y 5 días hábiles.

Para otras ciudades o municipios, el tiempo estimado es de 3 a 10 días hábiles.

El envío es gratuito para compras superiores a $250.000 COP.
Para compras inferiores, el costo estándar es de $10.000 COP.
        `,
        fuente: "https://www.adidas.co/ayuda/envio"
    },

    {
        id: 2,
        categoria: "Devoluciones",
        preguntas: [
            "¿Cómo hago una devolución?",
            "¿Puedo cambiar un producto?",
            "¿Cuántos días tengo para devolver?",
            "¿Dónde entrego una devolución?"
        ],
        keywords: [
            "devolucion",
            "cambio",
            "garantia",
            "devolver",
            "reembolso"
        ],
        contenido: `
Las devoluciones en Adidas Colombia son gratuitas.

Tienes hasta 60 días calendario desde la recepción del pedido para solicitar cambios o devoluciones.

Debes ingresar a la sección "Mis Pedidos", generar una guía de devolución
y entregar el paquete en un punto Servientrega autorizado.

Los productos Yeezy y colaboraciones especiales tienen únicamente 7 días para devolución.
        `,
        fuente: "https://www.adidas.co/ayuda/devoluciones"
    },

    {
        id: 3,
        categoria: "Pagos",
        preguntas: [
            "¿Qué medios de pago aceptan?",
            "¿Puedo pagar con PSE?",
            "¿Aceptan tarjetas?",
            "¿Se puede pagar contra entrega?"
        ],
        keywords: [
            "pago",
            "pse",
            "tarjeta",
            "visa",
            "mastercard",
            "efecty"
        ],
        contenido: `
Adidas Colombia acepta pagos con tarjetas Visa,
Mastercard y American Express.

También puedes pagar mediante PSE,
Efecty y pago contra entrega en ciudades seleccionadas.

No se aceptan cheques ni transferencias manuales fuera de la plataforma oficial.
        `,
        fuente: "https://www.adidas.co/ayuda/pagos"
    },

    {
        id: 4,
        categoria: "Productos",
        preguntas: [
            "¿Los productos son originales?",
            "¿Dónde fabrican los productos?",
            "¿La ropa es original?",
            "¿El calzado es auténtico?"
        ],
        keywords: [
            "original",
            "autentico",
            "producto",
            "calzado",
            "ropa"
        ],
        contenido: `
Todos los productos vendidos en adidas.co son 100% originales.

La mayoría del calzado y ropa deportiva es fabricada en países
como Vietnam, Indonesia y China bajo estándares internacionales de calidad.

Adidas garantiza autenticidad en todos los productos vendidos
desde la tienda oficial.
        `,
        fuente: "https://www.adidas.co/productos-info"
    },

    {
        id: 5,
        categoria: "Cuenta",
        preguntas: [
            "¿Cómo creo una cuenta?",
            "¿Necesito registrarme?",
            "¿Cómo inicio sesión?"
        ],
        keywords: [
            "cuenta",
            "registro",
            "usuario",
            "login",
            "sesion"
        ],
        contenido: `
Puedes crear una cuenta gratuita en Adidas Colombia
usando tu correo electrónico.

Tener una cuenta te permite rastrear pedidos,
guardar productos favoritos y acceder a promociones exclusivas.
        `,
        fuente: "https://www.adidas.co/account-register"
    }
];

// Crear carpeta data si no existe
const dataDir = path.join(__dirname, '../data');

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Guardar JSON
const dataPath = path.join(dataDir, 'knowledge.json');

fs.writeFileSync(
    dataPath,
    JSON.stringify(mockData, null, 2),
    'utf8'
);

console.log("✅ Base de conocimiento generada correctamente.");
console.log(`📁 Archivo creado en: ${dataPath}`);
console.log(`📦 Total registros: ${mockData.length}`);
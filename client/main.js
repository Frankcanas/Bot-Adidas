const chatContainer = document.querySelector('#chat-container');
const input = document.querySelector('#chat-input');
const sendBtn = document.querySelector('#send-btn');

console.log("Script cargado correctamente");

async function handleSendMessage() {
    const message = input.value.trim();
    if (!message) return;

    console.log("Enviando mensaje:", message);

    // Agregar mensaje del usuario a la interfaz
    appendMessage('user', message);
    input.value = '';
    
    // Scroll al final
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Mostrar estado de "escribiendo"
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message bot typing';
    typingIndicator.innerHTML = '<strong>Adidas Bot:</strong> <p>Escribiendo...</p>';
    chatContainer.appendChild(typingIndicator);

    try {
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();
        
        // Quitar indicador y mostrar respuesta
        chatContainer.removeChild(typingIndicator);
        appendMessage('bot', data.reply);

    } catch (error) {
        console.error("Error detallado del fetch:", error);
        chatContainer.removeChild(typingIndicator);
        appendMessage('bot', `Error de conexión: ${error.message}. Revisa que el servidor Node (puerto 3000) esté corriendo.`);
    }

    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function appendMessage(role, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}`;
    
    msgDiv.innerHTML = `
        <strong>${role === 'user' ? 'Tú' : 'Adidas Bot'}</strong>
        <p>${text}</p>
    `;
    
    chatContainer.appendChild(msgDiv);
}

sendBtn.addEventListener('click', handleSendMessage);
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSendMessage();
});

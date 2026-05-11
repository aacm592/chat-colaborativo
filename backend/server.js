const WebSocket = require('ws');
const http = require('http');

// Crear servidor HTTP base y acoplar el servidor WebSocket
const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Función auxiliar para asignar un identificador temporal
const generateUsername = () => `Usuario_${Math.floor(Math.random() * 10000)}`;

// Arreglo para almacenar los últimos mensajes en RAM
const chatHistory = [];

// Escuchar el evento de nueva conexión
wss.on('connection', (ws) => {
    // Asignar el nombre temporal al cliente que se acaba de conectar
    ws.username = generateUsername();
    console.log(`${ws.username} se ha conectado.`);

    // 1. Enviar el historial almacenado al usuario que acaba de ingresar
    ws.send(JSON.stringify({
        type: 'history',
        data: chatHistory
    }));

    // 2. Crear mensaje de ingreso, guardarlo y notificar a todos
    const joinMsg = { type: 'system', message: `${ws.username} se ha unido al chat.` };
    chatHistory.push(joinMsg);
    if (chatHistory.length > 100) chatHistory.shift(); // Mantener solo los últimos 100 mensajes
    
    broadcast(JSON.stringify(joinMsg));

    // Escuchar los mensajes que envía este cliente
    ws.on('message', (message) => {
        try {
            // Convertir el buffer a string y parsear el JSON
            const data = JSON.parse(message.toString());

            if (data.type === 'update_username') {
                // Lógica para actualizar el nombre
                const oldName = ws.username;
                ws.username = data.username;
                
                // Crear mensaje de sistema, guardarlo y avisar a la sala
                const updateMsg = { type: 'system', message: `${oldName} ahora es ${ws.username}.` };
                chatHistory.push(updateMsg);
                if (chatHistory.length > 100) chatHistory.shift();
                
                broadcast(JSON.stringify(updateMsg));
            } else if (data.type === 'chat') {
                // Lógica normal del chat: crear mensaje, guardarlo y retransmitir
                const chatMsg = { type: 'chat', user: ws.username, message: data.message };
                chatHistory.push(chatMsg);
                if (chatHistory.length > 100) chatHistory.shift();
                
                broadcast(JSON.stringify(chatMsg));
            }
        } catch (error) {
            console.error("Error al procesar el mensaje entrante:", error);
        }
    });

    // Escuchar y notificar a todos el evento de desconexión del cliente
    ws.on('close', () => {
        console.log(`${ws.username} se ha desconectado.`);
        
        const leaveMsg = { type: 'system', message: `${ws.username} ha abandonado el chat.` };
        chatHistory.push(leaveMsg);
        if (chatHistory.length > 10000) chatHistory.shift();
        
        broadcast(JSON.stringify(leaveMsg));
    });
});

// Función para enviar (retransmitir) datos a todos los clientes activos
function broadcast(data) {
    wss.clients.forEach((client) => {
        // Verificar que la conexión del cliente esté abierta antes de enviar
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

// Levantar el servidor en el puerto 8080
server.listen(8080, () => {
    console.log('Servidor WebSocket escuchando en ws://localhost:8080');
});
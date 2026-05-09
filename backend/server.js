const WebSocket = require('ws');
const http = require('http');

// Crear servidor HTTP base y acoplar el servidor WebSocket
const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Función auxiliar para asignar un identificador temporal
const generateUsername = () => `Usuario_${Math.floor(Math.random() * 10000)}`;

// Escuchar el evento de nueva conexión
wss.on('connection', (ws) => {
    // Asignar el nombre temporal al cliente que se acaba de conectar
    ws.username = generateUsername();
    console.log(`${ws.username} se ha conectado.`);

    // Notificar a todos los usuarios que alguien ingresó
    broadcast(JSON.stringify({ 
        type: 'system', 
        message: `${ws.username} se ha unido al chat.` 
    }));

    // Escuchar los mensajes que envía este cliente y enviarlo a todos los conectados
    ws.on('message', (message) => {
        broadcast(JSON.stringify({ 
            type: 'chat', 
            user: ws.username, 
            message: message.toString() 
        }));
    });

    // Escuchar y notificar a todos el evento de desconexión del cliente
    ws.on('close', () => {
        console.log(`${ws.username} se ha desconectado.`);
        broadcast(JSON.stringify({ 
            type: 'system', 
            message: `${ws.username} ha abandonado el chat.` 
        }));
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
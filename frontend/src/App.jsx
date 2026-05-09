import { useState, useEffect, useRef } from 'react';
import './App.css'; // Asegura la correcta vinculación de los estilos

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  
  const ws = useRef(null);
  const messagesEndRef = useRef(null); // Referencia ancla para el auto-scroll

  // Función para desplazar la vista al fondo
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Efecto que se dispara cada vez que cambia el estado 'messages'
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8080');

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() && ws.current) {
      ws.current.send(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="chat-container">
      <h2 className="chat-header">Parlet</h2>
      
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className="message-row">
            {msg.type === 'system' ? (
              <div className="message system">
                {msg.message}
              </div>
            ) : (
              <div className="message user">
                <span className="message-author">{msg.user}</span>
                {msg.message}
              </div>
            )}
          </div>
        ))}
        {/* Elemento invisible que sirve como objetivo para el scroll */}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="chat-form">
        <input 
          type="text" 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          placeholder="Escribe un mensaje..."
          className="chat-input"
        />
        <button type="submit" className="chat-submit">
          Enviar
        </button>
      </form>
    </div>
  );
}

export default App;
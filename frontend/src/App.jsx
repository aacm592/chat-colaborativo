import { useState, useEffect, useRef } from 'react';
import './App.css'; // Asegura la correcta vinculación de los estilos
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase";

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [user, setUser] = useState(null);

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

  const loginGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
  } catch (error) {
    console.log(error);
  }
};

// Sincronizar el nombre con el servidor cuando el usuario inicie sesión
  useEffect(() => {
    if (user && ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'update_username',
        username: user.displayName
      }));
    }
  }, [user]);
  const sendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() && ws.current) {
      ws.current.send(JSON.stringify({ 
        type: 'chat', 
        message: inputValue 
      }));
      setInputValue('');
    }
  };

  return (
    <div className="chat-container">
      <h2 className="chat-header">Parlet</h2>
      
      {!user ? (
  <button onClick={loginGoogle}>
    Login con Google
  </button>
) : (
  <p>Bienvenido {user.displayName}</p>
)}

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
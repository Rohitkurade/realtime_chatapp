import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './ChatApp.css';

const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

function ChatApp() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Handle incoming messages and events
  useEffect(() => {
    if (!socket) return;

    socket.on('chatHistory', (history) => {
      setMessages(history);
    });

    socket.on('receiveMessage', (messageData) => {
      setMessages((prev) => [...prev, messageData]);
    });

    socket.on('userJoined', (data) => {
      setMessages((prev) => [...prev, { ...data, isSystemMessage: true }]);
    });

    socket.on('userLeft', (data) => {
      setMessages((prev) => [...prev, { ...data, isSystemMessage: true }]);
    });

    socket.on('onlineUsers', (users) => {
      setOnlineUsers(users);
    });

    socket.on('userTyping', (data) => {
      setTypingUsers((prev) => ({
        ...prev,
        [data.username]: data.isTyping
      }));
    });

    return () => {
      socket.off('chatHistory');
      socket.off('receiveMessage');
      socket.off('userJoined');
      socket.off('userLeft');
      socket.off('onlineUsers');
      socket.off('userTyping');
    };
  }, [socket]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleJoin = () => {
    if (username.trim() && socket) {
      socket.emit('join', username);
      setIsJoined(true);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (currentMessage.trim() && socket && isJoined) {
      socket.emit('sendMessage', { message: currentMessage });
      setCurrentMessage('');
      socket.emit('typing', { isTyping: false });
    }
  };

  const handleTyping = (e) => {
    setCurrentMessage(e.target.value);
    
    if (socket && isJoined) {
      socket.emit('typing', { isTyping: true });
      
      // Clear typing timeout
      clearTimeout(typingTimeoutRef.current);
      
      // Set timeout to emit typing false after 3 seconds
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing', { isTyping: false });
      }, 3000);
    }
  };

  if (!isJoined) {
    return (
      <div className="join-container">
        <div className="join-box">
          <h1>💬 Real-Time Chat</h1>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name"
            onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
          />
          <button onClick={handleJoin} className="join-btn">
            Join Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="header">
        <h1>💬 Chat Room</h1>
        <div className="user-info">
          <span className="welcome">Welcome, {username}</span>
          <span className="online-count">👥 {onlineUsers.length} online</span>
        </div>
      </div>

      <div className="main-content">
        <div className="sidebar">
          <h3>Online Users</h3>
          <ul className="users-list">
            {onlineUsers.map((user, idx) => (
              <li key={idx} className="user-item">
                🟢 {user}
              </li>
            ))}
          </ul>
        </div>

        <div className="chat-section">
          <div className="messages-container">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${
                  msg.isSystemMessage
                    ? 'system-message'
                    : msg.username === username
                    ? 'sent'
                    : 'received'
                }`}
              >
                {msg.isSystemMessage ? (
                  <p className="system-text">{msg.message}</p>
                ) : (
                  <>
                    <span className="username">{msg.username}</span>
                    <p className="message-text">{msg.message}</p>
                    <span className="timestamp">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </>
                )}
              </div>
            ))}
            
            {Object.entries(typingUsers).map(
              ([user, isTyping]) =>
                isTyping && user !== username && (
                  <div key={user} className="typing-indicator">
                    <span className="username">{user}</span>
                    <span className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </span>
                  </div>
                )
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="message-form">
            <input
              type="text"
              value={currentMessage}
              onChange={handleTyping}
              placeholder="Type a message..."
              className="message-input"
            />
            <button type="submit" className="send-btn">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatApp;

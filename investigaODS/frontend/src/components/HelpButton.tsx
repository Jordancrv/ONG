import React, { useState, useRef, useEffect } from 'react';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { theme } from '../styles/theme';
import { chatService } from '../services/chat.service';

interface HelpButtonProps {
  show: boolean;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const HelpButton: React.FC<HelpButtonProps> = ({ show }) => {
  const { isMobile } = useBreakpoint();
  const [isOpen, setIsOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Call IA service
      const response = await chatService.sendMessage(messageText);
      
      // Add bot response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.success ? response.response : response.error || 'Lo siento, ocurrió un error.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Lo siento, no pude procesar tu mensaje. Por favor, intenta de nuevo.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    setShowChat(true);
    setIsOpen(false);
    handleSendMessage(action);
  };

  if (!show) return null;

  return (
    <>
      {/* Floating Help Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: isMobile ? '90px' : '30px',
          right: isMobile ? '20px' : '30px',
          width: isMobile ? '56px' : '64px',
          height: isMobile ? '56px' : '64px',
          borderRadius: '50%',
          backgroundColor: theme.colors.primary,
          border: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: isMobile ? '28px' : '32px',
          zIndex: 999,
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={(e) => {
          if (!isMobile) {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isMobile) {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
          }
        }}
      >
        🤖
      </button>

      {/* Chat Dialog */}
      {showChat && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setShowChat(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000,
            }}
          />

          {/* Chat Window */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              bottom: isMobile ? '160px' : '110px',
              right: isMobile ? '20px' : '30px',
              width: isMobile ? 'calc(100% - 40px)' : '380px',
              height: isMobile ? '500px' : '550px',
              maxWidth: isMobile ? '100%' : '400px',
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
              zIndex: 1001,
              animation: 'slideUp 0.3s ease-out',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <style>
              {`
                @keyframes slideUp {
                  from {
                    opacity: 0;
                    transform: translateY(20px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
              `}
            </style>

            {/* Chat Header */}
            <div
              style={{
                backgroundColor: theme.colors.primary,
                padding: '16px 20px',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '18px',
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>🤖</span>
                <span>Asistente Green Dream</span>
              </div>
              <button
                onClick={() => setShowChat(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '0',
                  lineHeight: '1',
                }}
              >
                ×
              </button>
            </div>

            {/* Messages Area */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {messages.length === 0 && (
                <div
                  style={{
                    textAlign: 'center',
                    color: '#666',
                    marginTop: '40px',
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
                  <p>¡Hola! Soy tu asistente de Green Dream.</p>
                  <p>¿En qué puedo ayudarte hoy?</p>
                </div>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: msg.sender === 'user' ? theme.colors.primary : 'white',
                      color: msg.sender === 'user' ? 'white' : '#333',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      wordWrap: 'break-word',
                    }}
                  >
                    {msg.text}
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#999',
                      marginTop: '4px',
                      textAlign: msg.sender === 'user' ? 'right' : 'left',
                    }}
                  >
                    {msg.timestamp.toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div
                  style={{
                    alignSelf: 'flex-start',
                    maxWidth: '80%',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: 'white',
                      color: '#333',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <span className="typing-animation">Escribiendo...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div
              style={{
                padding: '16px',
                backgroundColor: 'white',
                borderTop: '1px solid #e0e0e0',
                display: 'flex',
                gap: '8px',
              }}
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Escribe tu mensaje..."
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputText.trim()}
                style={{
                  padding: '12px 20px',
                  backgroundColor: theme.colors.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isLoading || !inputText.trim() ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  opacity: isLoading || !inputText.trim() ? 0.5 : 1,
                }}
              >
                📤
              </button>
            </div>
          </div>
        </>
      )}

      {/* Help Options Dialog */}
      {isOpen && !showChat && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000,
            }}
          />

          {/* Dialog */}
          <div
            style={{
              position: 'fixed',
              bottom: isMobile ? '160px' : '110px',
              right: isMobile ? '20px' : '30px',
              width: isMobile ? 'calc(100% - 40px)' : '320px',
              maxWidth: isMobile ? '100%' : '400px',
              backgroundColor: '#1e4a7a',
              borderRadius: '16px',
              padding: isMobile ? '20px' : '24px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
              zIndex: 1001,
              animation: 'slideUp 0.3s ease-out',
            }}
          >
            {/* Header */}
            <div
              style={{
                fontSize: isMobile ? '18px' : '20px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '16px',
              }}
            >
              ¿En qué puedo ayudarte?
            </div>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => handleQuickAction('Tengo dudas sobre el contenido de un curso')}
                style={{
                  padding: '14px 16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: isMobile ? '14px' : '15px',
                  textAlign: 'left',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                Tengo dudas sobre el contenido de un curso
              </button>

              <button
                onClick={() => handleQuickAction('Quiero saber qué curso puedo hacer')}
                style={{
                  padding: '14px 16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: isMobile ? '14px' : '15px',
                  textAlign: 'left',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                Quiero saber qué curso puedo hacer
              </button>

              <button
                onClick={() => handleQuickAction('No puedo reproducir la clase grabada')}
                style={{
                  padding: '14px 16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: isMobile ? '14px' : '15px',
                  textAlign: 'left',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                No puedo reproducir la clase grabada
              </button>
            </div>

            {/* Chat Button */}
            <button
              onClick={() => {
                setIsOpen(false);
                setShowChat(true);
              }}
              style={{
                marginTop: '16px',
                width: '100%',
                padding: '12px',
                backgroundColor: theme.colors.primary,
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: isMobile ? '14px' : '15px',
                fontWeight: 'bold',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1a5490';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.primary;
              }}
            >
              💬 Hablar con el asistente
            </button>

            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              style={{
                marginTop: '8px',
                width: '100%',
                padding: '12px',
                backgroundColor: 'transparent',
                color: theme.colors.primary,
                border: `2px solid ${theme.colors.primary}`,
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: isMobile ? '14px' : '15px',
                fontWeight: 'bold',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.primary;
                e.currentTarget.style.color = theme.colors.textDark;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = theme.colors.primary;
              }}
            >
              Cerrar
            </button>
          </div>
        </>
      )}
    </>
  );
};

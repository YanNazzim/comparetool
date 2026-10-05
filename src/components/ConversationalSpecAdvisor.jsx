// src/components/ConversationalSpecAdvisor.jsx
import React, { useState, useRef, useEffect } from 'react';
import './ConversationalSpecAdvisor.css';
import { parseHardwareQuery, getProductSpecInfo } from '../utils/hardwareEngine';

const DEFAULT_SUGGESTIONS = [
  { label: '🚪 8313 ET vs 9875L Mortise', query: '8313' },
  { label: '🏢 8813 ET vs 98L Wide Rim', query: '8813' },
  { label: '🏬 8513 ET vs 33A-L Narrow Rim', query: '8513' },
  { label: '📐 New 78L / 75L Equivalents', query: '78L' },
  { label: '📋 What is ANSI 08 vs 03?', query: 'what is ANSI 08' },
  { label: '⚡ Motorized Latch: 56- vs QEL', query: 'sargent 56 vs qel' }
];

function ConversationalSpecAdvisor({ onSelectComparison }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `👋 **Welcome to the Architectural Hardware Spec Advisor**\n\nI can cross-reference any **Sargent** device directly to **Von Duprin**, decode model numbers, verify ANSI/BHMA operational functions, and compare pricing.\n\n*Try typing a model number below or select a common specification query:*`,
      result: null
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      result: null
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    // Simulate snappy local AI response
    setTimeout(() => {
      const parsed = parseHardwareQuery(query);
      const assistantMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: parsed.text,
        result: parsed.product1 && parsed.product2 ? { p1: parsed.product1, p2: parsed.product2 } : null
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 280);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: `👋 Chat history cleared. Ask me about any exit device (e.g. \`8313\`, \`8804\`, \`PE8813\`, \`98L\`, \`78L\`) or ANSI function code.`,
        result: null
      }
    ]);
  };

  return (
    <div className="spec-advisor-container">
      {/* Advisor Header */}
      <div className="advisor-header">
        <div className="advisor-title-row">
          <div className="advisor-badge">
            <span className="ai-icon">✨</span>
            <span className="ai-title">AI Spec Advisor</span>
          </div>
          <span className="advisor-engine-badge">
            <span className="live-dot"></span> Offline Knowledge Engine
          </span>
        </div>
        <p className="advisor-subtitle">
          Natural language architectural cross-reference, ANSI standard bridge & catalog callout solver
        </p>
      </div>

      {/* Suggestion Chips */}
      <div className="advisor-chips-row">
        <span className="chips-label">Quick Queries:</span>
        <div className="chips-list">
          {DEFAULT_SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              className="chip-btn"
              onClick={() => handleSend(s.query)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Message Stream */}
      <div className="advisor-messages-box">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-message ${msg.sender}`}>
            <div className="message-avatar">
              {msg.sender === 'assistant' ? '🤖' : '👤'}
            </div>
            <div className="message-bubble">
              <div
                className="message-markdown"
                dangerouslySetInnerHTML={{
                  __html: formatMarkdown(msg.text)
                }}
              />

              {/* If comparison match found, show interactive preview card */}
              {msg.result && (
                <div className="chat-match-card">
                  <div className="match-card-header">
                    <span className="match-icon">⚖️</span>
                    <span>Matched Architecture Pair</span>
                  </div>
                  <div className="match-card-body">
                    <div className="match-col">
                      <span className="match-brand">SARGENT</span>
                      <span className="match-model">
                        {getProductSpecInfo(msg.result.p1).combinedNumber}
                      </span>
                      <span className="match-sub">{msg.result.p1.seriesName}</span>
                    </div>
                    <div className="match-divider">⟷</div>
                    <div className="match-col">
                      <span className="match-brand">VON DUPRIN</span>
                      <span className="match-model">
                        {getProductSpecInfo(msg.result.p2).combinedNumber}
                      </span>
                      <span className="match-sub">{msg.result.p2.seriesName}</span>
                    </div>
                  </div>
                  <button
                    className="match-open-btn"
                    onClick={() => onSelectComparison(msg.result.p1, msg.result.p2)}
                  >
                    Open in Classic Side-by-Side Comparison →
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="chat-message assistant typing">
            <div className="message-avatar">🤖</div>
            <div className="message-bubble typing-bubble">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Row */}
      <div className="advisor-input-area">
        <input
          type="text"
          className="advisor-input"
          placeholder="Ask a question or enter a model (e.g. '8313', '8804', '98L', '78L', 'ANSI 08')..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="advisor-send-btn"
          onClick={() => handleSend()}
          disabled={!inputValue.trim()}
        >
          Send
        </button>
        <button
          className="advisor-clear-btn"
          onClick={handleClear}
          title="Clear chat"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

// Simple markdown formatter helper for clean display
function formatMarkdown(text) {
  if (!text) return '';
  let formatted = text
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n• /g, '<br/>• ');
  return formatted;
}

export default ConversationalSpecAdvisor;

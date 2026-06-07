import React, { useState, useRef, useEffect } from 'react';
import { MessageSquareText, X, Send, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DOMPurify from 'dompurify';
import { buildings, extinguishers, audits } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';

const QUICK_QUESTIONS = [
  'Highest risk building?',
  'Expiring extinguishers?',
  'Overdue audits?',
];

const getAIResponses = () => {
  const crit = buildings.filter(b => b.riskLevel === 'Critical')[0] || buildings[0];
  const expiredExt = extinguishers.filter(e => e.status === 'Expired');
  
  return {
    'Highest risk building?': `**${crit?.name || 'N/A'}** has the highest risk score of **${crit?.riskScore || 0}/100**.`,
    'Expiring extinguishers?': `There are **${expiredExt.length} expired extinguishers** across the portfolio.`,
    'Overdue audits?': `There are **${audits.filter(a => a.status === 'Overdue').length} overdue audits**. Please check the Audits tab.`,
  };
};

const DEFAULT_RESPONSE = (msg) => {
  return `I can help with "${msg}". However, my floating widget is a quick reference. For a full analysis, please visit the AI Assistant page.`;
};

const MarkdownText = ({ text }) => {
  const lines = text.split('\n');
  return (
    <div>
      {lines.map((line, i) => {
        if (line.startsWith('**') && line.endsWith('**') && !line.slice(2, -2).includes('**')) {
          return <div key={i} style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, marginTop: i > 0 ? 10 : 0 }}>{line.slice(2, -2)}</div>;
        }
        if (!line.trim()) return <div key={i} style={{ height: 8 }} />;
        return <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4, lineHeight: 1.5 }}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(line.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text-primary)">$1</strong>')) }} />;
      })}
    </div>
  );
};

export default function FloatingAIAssistant() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', content: 'Hi there! I am FireGuard AI. How can I assist you with safety compliance today?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isOpen]);

  const sendMessage = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');

    const userMsg = { id: Date.now(), role: 'user', content: msg, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    const delay = 800 + Math.random() * 800;
    setTimeout(() => {
      setIsTyping(false);
      
      const msgLower = msg.toLowerCase();
      let responseText = null;
      if (msgLower.includes('risk')) responseText = 'Highest risk building?';
      else if (msgLower.includes('extinguish')) responseText = 'Expiring extinguishers?';
      else if (msgLower.includes('audit')) responseText = 'Overdue audits?';

      const aiMsg = {
        id: Date.now() + 1,
        role: 'ai',
        content: getAIResponses()[responseText] || DEFAULT_RESPONSE(msg),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    }, delay);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Only render if user is Admin or Analyst
  if (user?.role !== 'Admin' && user?.role !== 'Analyst') return null;

  return (
    <>
      {/* FAB */}
      <button
        className="fab-ai"
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed', bottom: 24, right: 24, width: 56, height: 56,
          borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
          color: 'white', display: isOpen ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shadow-lg)', cursor: 'pointer', zIndex: 1000, border: 'none', transition: 'transform 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <MessageSquareText size={24} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, width: 340, height: 480,
          background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)',
          zIndex: 1000, display: 'flex', flexDirection: 'column', border: '1px solid var(--border)', overflow: 'hidden',
          animation: 'fadeInUp 0.2s ease'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            color: 'white', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Zap size={20} />
              <div style={{ fontWeight: 700, fontSize: 15 }}>FireGuard AI</div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.8 }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                display: 'flex', flexDirection: 'column',
                alignItems: msg.role === 'ai' ? 'flex-start' : 'flex-end',
                marginBottom: 16
              }}>
                <div style={{
                  background: msg.role === 'ai' ? 'var(--bg-secondary)' : 'var(--color-primary)',
                  color: msg.role === 'ai' ? 'var(--text-primary)' : 'white',
                  padding: '10px 14px', borderRadius: 'var(--radius-md)', maxWidth: '85%'
                }}>
                  {msg.role === 'ai' ? <MarkdownText text={msg.content} /> : <span style={{ fontSize: 13 }}>{msg.content}</span>}
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ background: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>AI is analyzing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          <div style={{ padding: '0 16px 12px', display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {QUICK_QUESTIONS.map(q => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                style={{
                  background: 'transparent', border: '1px solid var(--border-light)', borderRadius: 999,
                  padding: '4px 10px', fontSize: 11, color: 'var(--text-secondary)', whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-light)', display: 'flex', gap: 8 }}>
            <input
              type="text"
              className="input"
              style={{ flex: 1, borderRadius: 999, padding: '8px 14px', fontSize: 13 }}
              placeholder="Ask AI..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="btn btn-primary btn-icon"
              style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0 }}
              onClick={() => sendMessage()}
              disabled={!input.trim() && !isTyping}
            >
              <Send size={14} />
            </button>
          </div>
          
          <div style={{ textAlign: 'center', paddingBottom: 10 }}>
              <button 
                onClick={() => { setIsOpen(false); navigate('/ai-assistant'); }}
                style={{ background: 'transparent', border: 'none', color: 'var(--color-primary)', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}
              >
                Open Full Assistant
              </button>
          </div>
        </div>
      )}
    </>
  );
}

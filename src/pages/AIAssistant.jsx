import React, { useState, useRef, useEffect } from 'react';
import { Send, Zap, Building2, Flame, FileText, AlertTriangle, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DOMPurify from 'dompurify';
import { buildings, extinguishers, audits, chatHistory } from '../data/mockData';

const QUICK_QUESTIONS = [
  'Which building has the highest risk?',
  'Show me expiring extinguishers',
  'Why is Prism Corporate Center critical?',
  'Generate a compliance summary',
  'Which audits are overdue?',
  'What are the top safety recommendations?',
];

const getAIResponses = () => {
  const crit = buildings.filter(b => b.riskLevel === 'Critical')[0] || buildings[0];
  const expiredExt = extinguishers.filter(e => e.status === 'Expired');
  const expiringExt = extinguishers.filter(e => e.status === 'Expiring Soon');
  
  return {
    'Which building has the highest risk?': `**${crit?.name || 'N/A'}** currently has the highest risk score of **${crit?.riskScore || 0}/100**, classified as **${crit?.riskLevel || 'Unknown'}**.
    
**Key Risk Factors:**
- 🔴 ${expiredExt.length} expired extinguishers across portfolio
- 🔴 Audit requires attention
- 🟡 Compliance score is ${crit?.complianceScore}%

This building poses significant regulatory and safety risk.`,

    'Show me expiring extinguishers': `Here are the extinguishers expiring within the next **30 days**:

${expiringExt.map(e => `- ${e.id} (${e.building}, FL ${e.floor}) — ${e.expiryDate}`).join('\n')}

**Additionally, ${expiredExt.length} units are already expired.**

**Recommendation:** Prioritize these replacements to avoid compliance violations.`,

    'Why is Prism Corporate Center critical?': `**${crit?.name}** (Risk Score: ${crit?.riskScore}/100) is classified as **Critical** for the following reasons:

**1. Expired Fire Extinguishers**
Multiple extinguishers have expired. This directly violates NBC 2016 fire safety norms and creates immediate hazard liability.

**2. Low Compliance Score**
The compliance score is dangerously low at ${crit?.complianceScore}%.

Timeline to compliance: 15–30 days with immediate action.`,

    'Generate a compliance summary': `## FireGuard AI — Portfolio Compliance Summary
**Generated:** ${new Date().toLocaleDateString('en-IN')}

### Overall Portfolio Health
- **Average Compliance Score:** ${(buildings.reduce((a,b)=>a+b.complianceScore,0)/buildings.length).toFixed(1)}%
- **Critical Buildings:** ${buildings.filter(b=>b.riskLevel==='Critical').length}
- **High Risk Buildings:** ${buildings.filter(b=>b.riskLevel==='High').length}

### Key Findings
- ${expiredExt.length} extinguishers expired, ${expiringExt.length} expiring within 30 days`,

    'Which audits are overdue?': `**Audits requiring attention:**

${audits.filter(a => a.status === 'Overdue' || a.status === 'Action Required').map(a => `- **${a.building}** (${a.id}) — Status: ${a.status}`).join('\n')}

Shall I generate a compliance enforcement notice?`,

    'What are the top safety recommendations?': `## Top Safety Recommendations — FireGuard AI

**🔴 Immediate (Next 48-72 hours):**
1. Replace ${expiredExt.length} expired extinguishers
2. Schedule emergency audit for ${crit?.name}

**🟡 Short-term (Next 15 days):**
3. Replace ${expiringExt.length} expiring extinguishers

**Projected Compliance Score (after actions):** 88.5% portfolio average`,
  };
};

const DEFAULT_RESPONSE = (msg) => {
  const expiredCount = extinguishers.filter(e => e.status === 'Expired').length;
  return `I've analyzed your query about **"${msg}"** across the FireGuard AI database.

Based on current data across ${buildings.length} buildings and ${extinguishers.length} tracked extinguisher units, here's my assessment:

**Key Concerns:**
- ${expiredCount} extinguishers expired
- ${buildings.filter(b=>b.complianceScore < 70).length} buildings below 70% compliance

Would you like me to provide more specific insights?`;
};

const MarkdownText = ({ text }) => {
  const lines = text.split('\n');
  return (
    <div>
      {lines.map((line, i) => {
        if (line.startsWith('## ')) return <div key={i} style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, marginTop: i > 0 ? 12 : 0 }}>{line.slice(3)}</div>;
        if (line.startsWith('**') && line.endsWith('**') && !line.slice(2, -2).includes('**')) {
          return <div key={i} style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, marginTop: i > 0 ? 10 : 0 }}>{line.slice(2, -2)}</div>;
        }
        if (line.startsWith('- ') || line.startsWith('• ')) {
          return <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', paddingLeft: 16, marginBottom: 4, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 4 }}>•</span>
            <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')) }} />
          </div>;
        }
        if (line.startsWith('| ')) {
          const cells = line.split('|').filter(c => c.trim());
          return <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 2 }}>
            {cells.map((cell, j) => (
              <div key={j} style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1, padding: '2px 0', borderBottom: line.includes('---') ? '1px solid var(--border-light)' : 'none' }}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(cell.trim().replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')) }} />
            ))}
          </div>;
        }
        if (!line.trim()) return <div key={i} style={{ height: 8 }} />;
        return <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4, lineHeight: 1.6 }}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(line.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text-primary)">$1</strong>')) }} />;
      })}
    </div>
  );
};

export default function AIAssistant() {
  const { user } = useAuth();
  const userInitials = user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'U';
  const [messages, setMessages] = useState(
    chatHistory.map(m => ({ ...m, timestamp: new Date(m.timestamp) }))
  );
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');

    // eslint-disable-next-line react-hooks/purity
    const userMsg = { id: Date.now(), role: 'user', content: msg, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate AI thinking time
    // eslint-disable-next-line react-hooks/purity
    const delay = 1000 + Math.random() * 1000;
    setTimeout(() => {
      setIsTyping(false);
      
      const INTENT_MAP = [
        { keywords: ['highest risk', 'most risk', 'dangerous', 'critical building'], key: 'Which building has the highest risk?' },
        { keywords: ['expir', 'extinguisher'], key: 'Show me expiring extinguishers' },
        { keywords: ['prism', 'bld-003'], key: 'Why is Prism Corporate Center critical?' },
        { keywords: ['compliance summary', 'portfolio summary', 'report'], key: 'Generate a compliance summary' },
        { keywords: ['overdue', 'audit'], key: 'Which audits are overdue?' },
        { keywords: ['recommendation', 'safety tip', 'what should'], key: 'What are the top safety recommendations?' },
      ];
      
      const msgLower = msg.toLowerCase();
      const matched = INTENT_MAP.find(intent => intent.keywords.some(kw => msgLower.includes(kw)));
      const responseText = matched ? matched.key : null;

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header info */}
      <div className="grid grid-3" style={{ gap: 16 }}>
        {[
          { icon: Building2, label: `${buildings.length} Buildings`, sub: 'Monitored in real-time', color: '#3B82F6' },
          { icon: Flame, label: `${extinguishers.length} Extinguishers`, sub: 'Actively tracked', color: '#F59E0B' },
          { icon: FileText, label: `${audits.length} Audit Records`, sub: 'Available for analysis', color: '#22C55E' },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: item.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} color={item.color} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{item.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chat Container */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {/* Chat Messages */}
        <div className="chat-messages" style={{ maxHeight: 480 }}>
          {messages.map(msg => (
            <div key={msg.id} className={`chat-message ${msg.role}`}>
              <div className={`chat-avatar ${msg.role}`}>
                {msg.role === 'ai' ? <Zap size={16} /> : userInitials}
              </div>
              <div className={`chat-bubble ${msg.role}`}>
                {msg.role === 'ai' ? (
                  <MarkdownText text={msg.content} />
                ) : (
                  <span style={{ fontSize: 13 }}>{msg.content}</span>
                )}
                <div style={{ fontSize: 10, opacity: 0.5, marginTop: 8 }}>
                  {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="chat-message ai">
              <div className="chat-avatar ai"><Zap size={16} /></div>
              <div className="chat-bubble ai">
                <div className="typing-indicator">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>AI is analyzing...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions */}
        <div className="chat-suggestions">
          {QUICK_QUESTIONS.map(q => (
            <button key={q} className="chat-suggestion-chip" onClick={() => sendMessage(q)}>
              {q}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="chat-input-area">
          <div style={{ flex: 1, position: 'relative' }}>
            <textarea
              ref={inputRef}
              className="chat-input"
              placeholder="Ask about buildings, compliance, risk, or request a report..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              style={{ resize: 'none' }}
            />
          </div>
          <button
            className="btn btn-primary btn-icon"
            onClick={() => sendMessage()}
            disabled={!input.trim() && !isTyping}
            style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', flexShrink: 0 }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

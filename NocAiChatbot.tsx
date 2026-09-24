import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Trash2,
  Terminal,
  Activity,
  CheckCircle2,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  codeSnippet?: string;
}

interface NocAiChatbotProps {
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
  isFullView?: boolean;
}

export const NocAiChatbot: React.FC<NocAiChatbotProps> = ({
  initialPrompt,
  onClearInitialPrompt,
  isFullView = false,
}) => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const userName = user?.name || 'Rudi';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Halo ${userName}! Saya asisten AI NOC. Anda dapat menanyakan analisa kesehatan server, perintah router (Cisco/Huawei), diagnosa redaman optik EA, atau investigasi log BNG.`,
      timestamp: 'Baru saja',
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle external incoming prompt (e.g. from Server Health "Tanya AI")
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  const generateAiResponse = (query: string): { text: string; codeSnippet?: string } => {
    const q = query.toLowerCase();

    if (q.includes('kesehatan') || q.includes('server') || q.includes('cpu') || q.includes('ram')) {
      return {
        text: `Berdasarkan pembacaan telemetri server NOC saat ini:
• CPU Load: 34% (Normal, Xeon Gold 16 Cores, temperatur 41°C)
• RAM: 61% (19.8 GB terpakai dari 32 GB, buffer memadai)
• Network Throughput: 24.8 Gbps stabil pada Core Gateway 10.12.0.1
• Node Status: BNG-GW-01, Aradial AAA RADIUS, dan DHCP Server berstatus ONLINE.

Kesimpulan: Seluruh beban server dalam ambang batas aman (SLA 99.98%). Tidak ada indikasi bottleneck saat ini.`,
      };
    }

    if (q.includes('bng') || q.includes('subscriber') || q.includes('pppoe') || q.includes('ipoe')) {
      return {
        text: `Untuk memeriksa sesi subscriber pada BNG Cisco IOS-XE / ASR9000, Anda dapat menjalankan command berikut:`,
        codeSnippet: `# Cek ringkasan total sesi subscriber aktif
show subscriber session summary

# Cek subscriber berdasarkan username spesifik
show subscriber session username <username>

# Cek status PPPoE interface dan SID
show pppoe session`,
      };
    }

    if (q.includes('redaman') || q.includes('optik') || q.includes('power') || q.includes('ea')) {
      return {
        text: `Panduan pengecekan Optical Power pelanggan EA:
1. Ambang batas normal Rx Power: -18 dBm s/d -22 dBm.
2. Jika terdeteksi drop di bawah -25 dBm:
   - Cek bending kabel dropcore/patchcord di ODF POP.
   - Bersihkan konektor optik menggunakan optical cleaner pen.
   - Periksa port PON OLT apakah mengalami fluktuasi sinyal.
3. Anda dapat menggunakan tool "CEK EA POP" di portal ini untuk cross-check data optical power live.`,
      };
    }

    if (q.includes('aradial') || q.includes('radius') || q.includes('reject')) {
      return {
        text: `Analisa log Aradial AAA:
• Access-Reject paling sering terjadi karena:
  1. Password / kredensial subscriber tidak cocok.
  2. Akun terblokir (Simultaneous-Use limit tercapai).
  3. NAS-IP atau Secret Key tidak sinkron antara BNG dan Aradial.
Gunakan tool "CEK ARADIAL BNG" untuk melihat reason reject spesifik.`,
      };
    }

    if (q.includes('traceroute') || q.includes('mpls') || q.includes('ping')) {
      return {
        text: `Untuk traceroute MPLS dengan tracking label stack Cisco:`,
        codeSnippet: `traceroute mpls ipv4 <ip-tujuan> /32 verbose`,
      };
    }

    // Default intelligent response
    return {
      text: `Saya menerima pertanyaan Anda mengenai: "${query}".\n\nUntuk operasional NOC, sistem telah terintegrasi dengan alat diagnostik BNG, DHCP, IP Lookup, dan Backbone. Silakan tanyakan sintaks CLI perangkat, analisa log, atau klik salah satu topik cepat di atas.`,
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsTyping(true);

    // Realistic brief typing delay
    await new Promise((r) => setTimeout(r, 650));

    const response = generateAiResponse(query);
    const aiMsg: ChatMessage = {
      id: `msg-ai-${Date.now()}`,
      sender: 'assistant',
      text: response.text,
      codeSnippet: response.codeSnippet,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, aiMsg]);
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const quickPrompts = [
    'Analisa kesehatan server saat ini',
    'Command cek sesi BNG Cisco',
    'Diagnosa optical power EA drop',
    'Troubleshoot Aradial Access-Reject',
  ];

  return (
    <div className={`flex flex-col h-full justify-between ${isFullView ? 'p-6 max-w-4xl mx-auto' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/40 dark:border-slate-800 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                NOC AI Copilot
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                AI
              </span>
            </div>
            <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Asisten Diagnosa & Troubleshooting Jaringan
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setMessages([
              {
                id: 'msg-welcome',
                sender: 'assistant',
                text: `Halo ${userName}! Chat telah direset. Ada yang bisa saya bantu terkait operasional NOC?`,
                timestamp: 'Baru saja',
              },
            ]);
          }}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Reset Percakapan"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className={`flex-1 overflow-y-auto space-y-3 pr-1 text-xs ${
        isFullView ? 'max-h-[600px] min-h-[400px]' : 'max-h-[280px] min-h-[220px]'
      }`}>
        {messages.map((msg) => {
          const isMe = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!isMe && (
                <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-500 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                isMe
                  ? 'bg-blue-600 text-white rounded-tr-xs'
                  : isDark
                    ? 'bg-[#10192b] border border-[#1a2b46] text-slate-200 rounded-tl-xs'
                    : 'bg-slate-100 border border-slate-200 text-slate-800 rounded-tl-xs'
              }`}>
                <div className="whitespace-pre-line">{msg.text}</div>

                {msg.codeSnippet && (
                  <div className="mt-2.5 rounded-xl bg-[#070b14] border border-slate-800 p-2.5 font-mono text-[11px] relative">
                    <button
                      onClick={() => handleCopyCode(msg.id, msg.codeSnippet!)}
                      className="absolute top-2 right-2 p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Salin Perintah"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <pre className="text-cyan-400 overflow-x-auto pr-7">
                      <code>{msg.codeSnippet}</code>
                    </pre>
                  </div>
                )}

                <div className={`text-[9px] mt-1 text-right ${
                  isMe ? 'text-blue-200' : isDark ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  {msg.timestamp}
                </div>
              </div>

              {isMe && (
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-2 items-center text-slate-400 text-xs">
            <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-500 border border-blue-500/30 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className={`p-2.5 rounded-2xl flex items-center gap-1.5 ${
              isDark ? 'bg-[#10192b] border border-[#1a2b46]' : 'bg-slate-100 border border-slate-200'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div className="pt-2 mb-2">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-1">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(p)}
              disabled={isTyping}
              className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all cursor-pointer ${
                isDark
                  ? 'bg-[#10192b] hover:bg-[#16233b] border-[#1a2b46] text-slate-300 hover:text-white'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-900'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 pt-2 border-t border-slate-800/40 dark:border-slate-800"
      >
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          disabled={isTyping}
          placeholder="Tanya AI tentang server, router, alarm..."
          className={`flex-1 px-3.5 py-2 rounded-xl border text-xs transition-all focus:outline-none focus:ring-1 ${
            isDark
              ? 'bg-[#090f1d] border-[#18263e] text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20'
              : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-blue-600/20'
          }`}
        />
        <button
          type="submit"
          disabled={!inputPrompt.trim() || isTyping}
          className={`p-2 rounded-xl text-white transition-all cursor-pointer ${
            !inputPrompt.trim() || isTyping
              ? 'bg-blue-600/50 cursor-not-allowed opacity-60'
              : 'bg-blue-600 hover:bg-blue-500 shadow-sm shadow-blue-600/30'
          }`}
          title="Kirim Pesan"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

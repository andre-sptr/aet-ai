'use client';

import { useState, useRef, useEffect } from 'react';
import { Message, ChatMode } from '@/types';
import MessageBubble from './MessageBubble';
import { Send, Loader2, Trash2, ArrowLeft, Sparkles } from 'lucide-react';

interface ChatInterfaceProps {
  mode: ChatMode;
  modeTitle: string;
  onBack: () => void;
}

export default function ChatInterface({ mode, modeTitle, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const greetingMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: 'Halo! Saya asisten AI untuk Himpunan Mahasiswa AET PCR. Ada yang bisa saya bantu?',
      timestamp: new Date()
    };
    setMessages([greetingMessage]);
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          mode
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Maaf, terjadi kesalahan: ${error.message}. Silakan coba lagi.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    if (confirm('Hapus semua percakapan?')) {
      setMessages([{
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Halo! Saya asisten AI untuk Himpunan Mahasiswa AET PCR. Ada yang bisa saya bantu?',
        timestamp: new Date()
      }]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
      {/* Modern Header */}
      <div className="relative bg-gradient-to-r from-[#0056D2] to-[#003d96] text-white shadow-2xl">
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNGgtMnYyaDJ2LTJ6bTAgMnYyaDJ2LTJoLTJ6bTItMmgydjJoLTJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        
        <div className="relative max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="group hover:bg-white/20 p-2.5 rounded-xl transition-all duration-300 hover:scale-110"
                aria-label="Kembali"
              >
                <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">{modeTitle}</h1>
                  <p className="text-sm text-blue-100 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Online • AET AI Assistant
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handleClearChat}
              className="group flex items-center gap-2 bg-[#D32F2F] hover:bg-[#B71C1C] px-5 py-2.5 rounded-xl transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105"
              aria-label="Hapus Chat"
            >
              <Trash2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Hapus Chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <MessageBubble message={message} />
            </div>
          ))}
          
          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-4 animate-slide-up">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div className="glass-effect rounded-3xl rounded-tl-none px-6 py-4 shadow-xl">
                <div className="flex gap-2">
                  <span className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Modern Input Area */}
      <div className="border-t border-gray-200/50 bg-white/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="glass-effect rounded-2xl p-4 shadow-xl">
            <div className="flex gap-3 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ketik pesan Anda di sini..."
                className="flex-1 resize-none bg-transparent px-4 py-3 focus:outline-none text-[#1A1A1A] placeholder:text-gray-400 max-h-32"
                rows={1}
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="relative group bg-gradient-to-r from-[#0056D2] to-[#003d96] text-white p-4 rounded-xl hover:shadow-lg disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex-shrink-0 hover:scale-105 disabled:hover:scale-100"
                aria-label="Kirim"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                )}
                
                {/* Button Glow Effect */}
                {!isLoading && input.trim() && (
                  <div className="absolute inset-0 bg-blue-400 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity -z-10" />
                )}
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center flex items-center justify-center gap-2">
            <kbd className="px-2 py-1 bg-gray-100 rounded text-[10px] font-mono">Enter</kbd>
            untuk mengirim •
            <kbd className="px-2 py-1 bg-gray-100 rounded text-[10px] font-mono">Shift + Enter</kbd>
            untuk baris baru
          </p>
        </div>
      </div>
    </div>
  );
}
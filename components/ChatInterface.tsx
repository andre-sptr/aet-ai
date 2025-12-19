'use client';

import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Message, ChatMode } from '@/types';
import MessageBubble from './MessageBubble';
import { Camera, Paperclip, X, Send, Loader2, Trash2, ArrowLeft, FileText, Code, MessageCircle } from 'lucide-react';

interface ChatInterfaceProps {
  mode: ChatMode;
  modeTitle: string;
  onBack: () => void;
}

export default function ChatInterface({ mode, modeTitle, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachment, setAttachment] = useState<{ content: string; mimeType: string; type: 'image' | 'file'; fileName: string; } | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const greetingMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: 'Halo! Saya asisten AI Himpunan Mahasiswa AET PCR. Ada yang bisa saya bantu?',
      timestamp: new Date()
    };
    setMessages([greetingMessage]);
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [input]);

  const processMessageToAI = async (currentHistory: Message[]) => {
    setIsLoading(true);
    try {
      const apiMessages = currentHistory.slice(
        currentHistory.findIndex(msg => msg.role === 'user')
      );

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          mode
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to get response');

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

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          const MAX_DIMENSION = 1280;
          
          if (width > height) {
            if (width > MAX_DIMENSION) {
              height *= MAX_DIMENSION / width;
              width = MAX_DIMENSION;
            }
          } else {
            if (height > MAX_DIMENSION) {
              width *= MAX_DIMENSION / height;
              height = MAX_DIMENSION;
            }
          }

          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL('image/jpeg', 0.7); 
          resolve(dataUrl);
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      let content = '';
      let mimeType = file.type;

      if (file.type.startsWith('image/')) {
        content = await compressImage(file);
        
        mimeType = 'image/jpeg'; 
        
      } else {
        if (file.size > 5 * 1024 * 1024) {
          alert('Ukuran file dokumen terlalu besar (Max 5MB)');
          e.target.value = ''; 
          return;
        }
        
        content = await new Promise<string>((resolve, reject) => {
           const reader = new FileReader();
           reader.onload = (evt) => resolve(evt.target?.result as string);
           reader.onerror = reject;
           reader.readAsDataURL(file);
        });
      }

      setAttachment({
        content: content,
        mimeType: mimeType,
        type: mimeType.startsWith('image/') ? 'image' : 'file',
        fileName: file.name
      });
      
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Gagal memproses file. Silakan coba lagi.');
    } finally {
      e.target.value = '';
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !attachment) || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
      attachment: attachment ? { ...attachment } : undefined 
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setAttachment(null);
    
    if (inputRef.current) inputRef.current.style.height = 'auto';

    await processMessageToAI(newHistory);
  };

  const handleReload = async () => {
    if (isLoading || messages.length === 0) return;
    const lastMessage = messages[messages.length - 1];
    let historyToRetry = [...messages];
    if (lastMessage.role === 'assistant') {
        historyToRetry.pop();
    }
    setMessages(historyToRetry);
    await processMessageToAI(historyToRetry);
  };

  const handleEditStart = (message: Message) => {
    setEditingMessageId(message.id);
  };

  const handleEditCancel = () => {
    setEditingMessageId(null);
  };

  const handleEditSave = async (id: string, newContent: string) => {
    setEditingMessageId(null);
    const index = messages.findIndex(m => m.id === id);
    if (index === -1) return;
    const newHistory = messages.slice(0, index + 1);
    newHistory[index] = { ...newHistory[index], content: newContent };
    setMessages(newHistory);
    await processMessageToAI(newHistory);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
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
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                ${mode === 'coding' ? 'bg-blue-100 text-blue-600' : 
                  mode === 'report' ? 'bg-emerald-100 text-emerald-600' : 
                  'bg-violet-100 text-violet-600'}`}
              >
                {mode === 'coding' ? (
                  <Code className="w-4 h-4" />
                ) : mode === 'report' ? (
                  <FileText className="w-4 h-4" />
                ) : (
                  <MessageCircle className="w-4 h-4" />
                )}
              </div>
              <div>
                <h1 className="text-sm font-bold text-slate-900">{modeTitle}</h1>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-xs text-slate-500">Active</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleClearChat}
            className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Area - Adjusted for fixed header */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pt-20 pb-4 bg-slate-50/50">
        <div className="max-w-4xl mx-auto px-4 py-4 space-y-6">
          {(() => {
            const lastUserMessageId = messages.slice().reverse().find(m => m.role === 'user')?.id;

            return messages.map((message, index) => (
              <div
                key={message.id}
                className="animate-slide-down"
                style={{ animationDelay: `${index * 20}ms` }}
              >
                <MessageBubble 
                  message={message}
                  mode={mode}
                  onRetry={handleReload}
                  onEdit={handleEditStart}
                  onSave={handleEditSave}
                  onCancel={handleEditCancel}
                  isEditable={message.id === lastUserMessageId}
                  isEditing={message.id === editingMessageId}
                  isLast={index === messages.length - 1}
                />
              </div>
            ));
          })()}
          
          {isLoading && (
            <div className="flex gap-4 animate-slide-down">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm mt-1 bg-gradient-to-br from-blue-600 to-indigo-600'}`}>
                {mode === 'coding' ? (
                  <Code className="w-4 h-4" />
                ) : mode === 'report' ? (
                  <FileText className="w-4 h-4" />
                ) : (
                  <MessageCircle className="w-4 h-4" />
                )}
              </div>
              <div className="bg-white rounded-2xl rounded-tl-none px-6 py-4 shadow-sm border border-slate-100">
                <div className="flex gap-1.5">
                  {[0, 150, 300].map(delay => (
                    <span key={delay} className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white/80 backdrop-blur-lg border-t border-slate-100 pb-6 pt-4 px-4">
        <div className="max-w-4xl mx-auto relative">
          {attachment && (
            <div className="absolute -top-20 left-0 right-0 px-1 animate-slide-up">
              <div className="inline-flex items-center gap-3 p-2 pr-4 bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50">
                <div className="relative w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 flex items-center justify-center">
                  {attachment.type === 'image' ? (
                    <img src={attachment.content} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <FileText className="w-6 h-6 text-blue-500" />
                  )}
                </div>

                <div className="flex flex-col min-w-[120px] max-w-[200px]">
                  <p className="text-sm font-semibold text-slate-700 truncate" title={attachment.fileName}>
                    {attachment.fileName}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium uppercase">
                    {attachment.type === 'image' ? 'Image' : attachment.fileName.split('.').pop() || 'File'}
                  </p>
                </div>

                <button 
                  onClick={() => setAttachment(null)}
                  className="p-1.5 ml-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            className="hidden" 
            accept="image/*, application/pdf"
          />

          <input 
            type="file" 
            ref={cameraInputRef} 
            onChange={handleFileSelect} 
            className="hidden"
            accept="image/*"
            capture="environment"
          />

          <div className="relative bg-white rounded-3xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.08)] border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-blue-100 transition-shadow flex items-end">
            <div className="flex items-center gap-1 pl-3 pb-3">
              <button 
                onClick={() => fileInputRef.current?.click()} 
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                title="Upload File"
                disabled={isLoading}
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <button 
                onClick={() => cameraInputRef.current?.click()}
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                title="Kamera"
                disabled={isLoading}
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>

            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ketik pesan..."
              className="flex-1 bg-transparent px-4 py-4 focus:outline-none text-slate-800 placeholder:text-slate-400 custom-scrollbar resize-none overflow-y-auto max-h-[200px]"
              rows={1}
              style={{ minHeight: '60px' }}
              disabled={isLoading}
            />

            <div className="pr-3 pb-3">
              <button
                onClick={handleSend}
                disabled={(!input.trim() && !attachment) || isLoading}
                className={`p-2.5 rounded-2xl transition-all duration-300 flex items-center justify-center ${(!input.trim() && !attachment) || isLoading ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:scale-105 active:scale-95'}`}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 text-center">AI dapat melakukan kesalahan. Mohon verifikasi informasi penting.</p>
        </div>
      </div>
    </div>
  );
}
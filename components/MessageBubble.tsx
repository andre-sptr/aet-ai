import { useState, useRef, useEffect } from 'react';
import { Message, ChatMode } from '@/types';
import { X, User, Volume2, Copy, RotateCw, Check, Pencil, Save, Code, Eye, FileText, MessageCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import mermaid from 'mermaid';

const CodeBlock = ({ inline, className, children, ...props }: any) => {
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const codeContent = String(children).replace(/\n$/, '');
  
  const [isCopied, setIsCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'code' | 'preview'>('code');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (inline || !match) {
    return (
      <code className="bg-slate-100 text-pink-600 px-1.5 py-0.5 rounded text-[13px] font-mono" {...props}>
        {children}
      </code>
    );
  }

  return (
    <div className="rounded-md overflow-hidden my-4 border border-slate-200 shadow-sm bg-slate-900">
       <div className="flex items-center justify-between px-3 py-2 bg-slate-800 border-b border-slate-700">
          <div className="flex items-center gap-3">
             <span className="text-xs font-bold text-slate-300 lowercase font-mono">{language}</span>
             
             {language === 'html' && (
                <div className="flex bg-slate-900/50 rounded-lg p-0.5 border border-slate-700">
                   <button onClick={() => setViewMode('code')} className={`flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-md transition-all ${viewMode === 'code' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>
                      <Code className="w-3 h-3" /> Code
                   </button>
                   <button onClick={() => setViewMode('preview')} className={`flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-md transition-all ${viewMode === 'preview' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>
                      <Eye className="w-3 h-3" /> Preview
                   </button>
                </div>
             )}
          </div>

          <button onClick={handleCopy} className="flex items-center gap-1.5 text-[10px] text-slate-400 hover:text-white transition-colors">
             {isCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
             <span>{isCopied ? 'Disalin!' : 'Salin Code'}</span>
          </button>
       </div>

       {/* Content Area */}
       {viewMode === 'preview' && language === 'html' ? (
          <div className="bg-white h-auto min-h-[200px] border-b border-slate-100 relative">
             <div className="absolute top-0 left-0 right-0 h-6 bg-slate-100 flex items-center px-2 gap-1 border-b border-slate-200">
                <div className="w-2 h-2 rounded-full bg-red-400/50"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-400/50"></div>
                <div className="w-2 h-2 rounded-full bg-green-400/50"></div>
                <span className="ml-2 text-[10px] text-slate-400">Browser Preview</span>
             </div>
             <iframe 
               srcDoc={codeContent} 
               className="w-full h-full min-h-[300px] pt-6" 
               title="Preview"
               sandbox="allow-scripts"
             />
          </div>
       ) : (
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            <SyntaxHighlighter
               style={oneDark}
               language={language}
               PreTag="div"
               customStyle={{ margin: 0, borderRadius: 0, fontSize: '13px', backgroundColor: '#0f172a' }}
               {...props}
            >
               {codeContent}
            </SyntaxHighlighter>
          </div>
       )}
    </div>
  );
};

const Mermaid = ({ chart }: { chart: string }) => {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const renderChart = async () => {
      try {
        mermaid.initialize({ startOnLoad: false, theme: 'neutral', securityLevel: 'loose' });
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        setSvg(svg);
        setError(false);
      } catch (err) {
        console.error('Mermaid render error:', err);
        setError(true);
      }
    };
    renderChart();
  }, [chart]);

  if (error) {
    return (
      <div className="p-3 bg-red-50 text-red-600 text-xs rounded border border-red-100 font-mono">
        Gagal merender diagram. Kode tidak valid.
      </div>
    );
  }

  return (
    <div 
      className="my-4 p-4 bg-white rounded-xl border border-slate-200 overflow-x-auto flex justify-center shadow-sm"
      dangerouslySetInnerHTML={{ __html: svg }} 
    />
  );
};

interface MessageBubbleProps {
  message: Message;
  mode?: ChatMode;
  onRetry?: (message: Message) => void;
  onEdit?: (message: Message) => void;
  onSave?: (id: string, newContent: string) => void;
  onCancel?: () => void;
  isEditable?: boolean;
  isEditing?: boolean; 
  isLast?: boolean;
}

export default function MessageBubble({ 
  message,
  mode = 'daily',
  onRetry, 
  onEdit, 
  onSave, 
  onCancel,
  isEditable, 
  isEditing,
  isLast
}: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const [isCopied, setIsCopied] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [editedText, setEditedText] = useState(message.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing) {
      setEditedText(message.content);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isEditing, message.content]);

  const handleRead = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      if (isReading) {
        setIsReading(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(message.content);
      utterance.lang = 'id-ID';
      utterance.rate = 1;
      
      utterance.onend = () => setIsReading(false);
      
      setIsReading(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Gagal menyalin:', err);
    }
  };

  const handleSaveClick = () => {
    if (onSave && editedText.trim() !== '') {
      onSave(message.id, editedText);
    }
  };

  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'} group items-start`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm mt-1 ${isUser ? 'bg-slate-200' : 'bg-gradient-to-br from-blue-600 to-indigo-600'}`}>
        {isUser ? (
          <User className="w-4 h-4 text-slate-600" />
        ) : (
          mode === 'coding' ? (
            <Code className="w-4 h-4 text-white" />
          ) : mode === 'report' ? (
            <FileText className="w-4 h-4 text-white" />
          ) : (
            <MessageCircle className="w-4 h-4 text-white" />
          )
        )}
      </div>

      {/* Bubble Container */}
      <div className={`flex flex-col gap-1 max-w-[85%] ${isEditing ? 'w-full' : 'w-fit'}`}>
        <div className={`px-5 py-4 shadow-sm relative transition-all duration-200 ${isUser ? 'bg-blue-600 text-white rounded-[24px] rounded-br-none' : 'bg-white text-slate-800 border border-slate-100 rounded-[24px] rounded-bl-none hover:shadow-md'}`}>
          {message.attachment && (
            <div className="mb-3">
              {message.attachment.type === 'image' ? (
                <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm relative group/image max-w-sm"
                  onClick={() => setIsImageOpen(true)}
                >
                  <img 
                    src={message.attachment.content} 
                    alt="Attachment" 
                    className="max-w-full h-auto max-h-[300px] object-cover bg-slate-100" 
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity flex justify-between items-end">
                    <span className="text-[10px] text-white/90 truncate max-w-[150px] px-1">
                      {message.attachment.fileName}
                    </span>
                    <a href={message.attachment.content} download={message.attachment.fileName} className="p-1.5 bg-white/20 hover:bg-white/40 text-white rounded-lg backdrop-blur-sm">
                      <Save className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl max-w-sm hover:bg-slate-100 transition-colors group/file">
                  <div className="w-10 h-10 bg-white rounded-lg border border-slate-100 flex items-center justify-center shadow-sm text-blue-500">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate" title={message.attachment.fileName}>
                      {message.attachment.fileName}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase">
                      {message.attachment.fileName.split('.').pop()} File
                    </p>
                  </div>
                  <a 
                    href={message.attachment.content} 
                    download={message.attachment.fileName}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Save className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          )}

          {isEditing ? (
            <div className="flex flex-col gap-3 w-full min-w-[250px]">
              <textarea
                ref={textareaRef}
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className={`w-full p-2 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-opacity-50
                  ${isUser 
                    ? 'bg-blue-700 text-white placeholder-blue-300 focus:ring-white border border-blue-500' 
                    : 'bg-slate-50 text-slate-800 focus:ring-blue-500 border border-slate-200'}`}
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <button 
                  onClick={onCancel}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border
                    ${isUser 
                      ? 'border-blue-400 hover:bg-blue-500 text-blue-100' 
                      : 'border-slate-200 hover:bg-slate-100 text-slate-600'}`}
                >
                  Batal
                </button>
                <button 
                  onClick={handleSaveClick}
                  disabled={!editedText.trim()}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-transform active:scale-95
                    ${isUser 
                      ? 'bg-white text-blue-600 hover:bg-blue-50' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  <Save className="w-3 h-3" />
                  Simpan & Kirim
                </button>
              </div>
            </div>
          ) : (
            <div className="text-[15px] leading-7">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code: CodeBlock,
                  ul: ({children}) => <ul className="list-disc pl-4 mb-3 space-y-1">{children}</ul>,
                  ol: ({children}) => <ol className="list-decimal pl-4 mb-3 space-y-1">{children}</ol>,
                  li: ({children}) => <li className="pl-1">{children}</li>,
                  p: ({children}) => <p className="mb-3 last:mb-0">{children}</p>,
                  strong: ({children}) => <span className="font-bold opacity-90">{children}</span>,
                  a: ({href, children}) => (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:text-blue-300">
                      {children}
                    </a>
                  ),
                  h1: ({children}) => <h1 className="text-lg font-bold mb-2 mt-4 pb-2 border-b border-white/20">{children}</h1>,
                  h2: ({children}) => <h2 className="text-base font-bold mb-2 mt-4">{children}</h2>,
                  blockquote: ({children}) => (
                    <blockquote className={`border-l-4 pl-4 py-1 my-3 italic ${isUser ? 'border-white/30 bg-blue-700/30' : 'border-blue-500 bg-blue-50 text-slate-600'}`}>
                      {children}
                    </blockquote>
                  ),
                  table: ({children}) => <div className="overflow-x-auto my-4"><table className="min-w-full divide-y divide-slate-200 border border-slate-200 rounded-lg">{children}</table></div>,
                  th: ({children}) => <th className="px-3 py-2 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-slate-200">{children}</th>,
                  td: ({children}) => <td className="px-3 py-2 whitespace-nowrap text-sm border-b border-slate-100">{children}</td>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}

          {!isEditing && (
            <>
              <div className={`h-[1px] w-full my-3 ${isUser ? 'bg-white/20' : 'bg-slate-100'}`} />
              <div className={`flex items-center gap-4 text-xs font-medium ${isUser ? 'text-blue-100 justify-end' : 'text-slate-400'}`}>
                {isUser ? (
                  <>
                    {isEditable && (
                      <button 
                        onClick={() => onEdit?.(message)}
                        className="flex items-center gap-1.5 hover:text-white transition-colors"
                        title="Edit Pesan"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    )}
                    <button onClick={handleCopy} className="flex items-center gap-1.5 hover:text-white transition-colors">
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Tersalin' : 'Salin'}</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={handleRead} className={`flex items-center gap-1.5 hover:text-blue-600 transition-colors ${isReading ? 'text-blue-600 font-bold' : ''}`}>
                      <Volume2 className="w-3.5 h-3.5" /> <span>{isReading ? 'Stop' : 'Baca'}</span>
                    </button>
                    <button onClick={handleCopy} className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} <span>{isCopied ? 'Tersalin' : 'Salin'}</span>
                    </button>
                    {isLast && (
                      <button onClick={() => onRetry?.(message)} className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                        <RotateCw className="w-3.5 h-3.5" /> <span>Ulangi</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </>
          )}

          {isImageOpen && message.attachment && message.attachment.type === 'image' && (
            <div 
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-200"
              onClick={(e) => {
                if (e.target === e.currentTarget) setIsImageOpen(false);
              }}
            >
              <button 
                onClick={() => setIsImageOpen(false)}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-20"
              >
                <X className="w-8 h-8" />
              </button>

              <div className="relative max-w-7xl w-full h-full flex items-center justify-center">
                <img 
                  src={message.attachment.content} 
                  alt="Full Preview" 
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                />
                
                <a 
                  href={message.attachment.content} 
                  download={message.attachment.fileName}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-6 flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors border border-white/10 shadow-xl"
                >
                  <Save className="w-5 h-5" />
                  <span className="text-sm font-medium">Download</span>
                </a>
              </div>
            </div>
          )}
        </div>
        
        {/* Timestamp */}
        <div className={`flex items-center gap-1.5 px-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-[10px] text-slate-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            {new Date(message.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
}
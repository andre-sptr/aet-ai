import { Message } from '@/types';
import { Bot, User, Check, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} group`}>
      {/* Avatar with modern styling */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300 ${
          isUser 
            ? 'bg-gradient-to-br from-[#0056D2] to-[#003d96]' 
            : 'bg-gradient-to-br from-blue-500 to-blue-600'
        }`}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col gap-1 max-w-[75%]`}>
        <div
          className={`rounded-3xl px-6 py-4 shadow-lg transform group-hover:scale-[1.02] transition-all duration-300 ${
            isUser
              ? 'bg-gradient-to-br from-[#0056D2] to-[#003d96] text-white rounded-tr-lg'
              : 'glass-effect text-[#1A1A1A] rounded-tl-lg'
          }`}
        >
          {/* Message Text */}
          <div className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">
            {message.content}
          </div>
        </div>
        
        {/* Timestamp & Status */}
        <div className={`flex items-center gap-1.5 px-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className={`text-xs ${isUser ? 'text-gray-500' : 'text-gray-400'}`}>
            {new Date(message.timestamp).toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
          {isUser && (
            <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
          )}
        </div>
      </div>
    </div>
  );
}
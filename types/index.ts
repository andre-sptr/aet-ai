export type ChatMode = 'coding' | 'report' | 'daily';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'model';
  content: string;
  timestamp: Date;
  attachment?: {
    type: 'image' | 'file';
    content: string;
    mimeType: string;
    fileName: string;
  };
}

export interface ChatModeConfig {
  id: ChatMode;
  title: string;
  description: string;
  icon: string;
  systemInstruction: string;
  color: string;
}

export interface ChatRequest {
  messages: Message[];
  mode: ChatMode;
}

export interface ChatResponse {
  response: string;
  error?: string;
}
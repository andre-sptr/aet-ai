export type ChatMode = 'coding' | 'report' | 'daily';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
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
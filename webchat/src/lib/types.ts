export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  isVoice?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  preview: string;
  date: string;
  messages: Message[];
}

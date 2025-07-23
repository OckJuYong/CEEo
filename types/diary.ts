export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface DiaryEntry {
  id: string;
  date: string; // YYYY-MM-DD format
  messages: ChatMessage[];
  summary: string;
  emotion: string;
  imageUrl: string;
  createdAt: Date;
}
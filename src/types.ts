export type ViewState = 'landing' | 'dashboard' | 'reader' | 'report' | 'profile' | 'settings';

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl?: string; // For mock data
  cover_url?: string; // From backend
  file_url?: string;
  file_type?: string;
  total_pages?: number;
  progress: number;
  lastRead?: string;
  category?: string;
  isFinished?: boolean;
  description?: string;
  metadata?: any;
  reading_progress?: any;
}

export interface ReadingStat {
  day: string;
  minutes: number;
}

export interface Insight {
  id: string;
  type: 'concept' | 'quote' | 'habit';
  bookTitle: string;
  content: string;
  subText?: string;
}

export interface User {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
  role: 'free' | 'premium';
  preferences: {
    darkMode: boolean;
    notifications: boolean;
    fontSize: string;
  };
  reading_goal: number;
  created_at: string;
}

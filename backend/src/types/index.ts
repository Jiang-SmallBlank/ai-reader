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
  updated_at: string;
  last_login_at?: string;
}

export interface Book {
  id: string;
  user_id: string;
  title: string;
  author?: string;
  cover_url?: string;
  description?: string;
  category?: string;
  file_url?: string;
  file_type?: string;
  total_pages?: number;
  isbn?: string;
  language?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ReadingProgress {
  id: string;
  user_id: string;
  book_id: string;
  current_page: number;
  current_position?: Record<string, any>;
  progress_percentage: number;
  is_finished: boolean;
  last_read_at: string;
  created_at: string;
  updated_at: string;
}

export interface ReadingSession {
  id: string;
  user_id: string;
  book_id: string;
  started_at: string;
  ended_at?: string;
  duration_seconds?: number;
  pages_read: number;
  focus_score?: number;
  status: 'active' | 'completed' | 'abandoned';
  metadata: Record<string, any>;
}

export interface Bookmark {
  id: string;
  user_id: string;
  book_id: string;
  page_number?: number;
  chapter?: string;
  position_json?: Record<string, any>;
  note?: string;
  created_at: string;
}

export interface Quote {
  id: string;
  user_id: string;
  book_id: string;
  content: string;
  page_number?: number;
  chapter?: string;
  tags: string[];
  is_favorite: boolean;
  created_at: string;
}

export interface Insight {
  id: string;
  user_id: string;
  book_id?: string;
  type: 'concept' | 'quote' | 'habit';
  content: string;
  sub_text?: string;
  source_pages?: number[];
  metadata: Record<string, any>;
  created_at: string;
}

export interface WeeklyReport {
  id: string;
  user_id: string;
  week_start: string;
  week_end: string;
  total_pages_read: number;
  total_reading_time_seconds: number;
  books_finished: number;
  new_vocabulary: number;
  streak_weeks: number;
  summary?: string;
  stats_json: Record<string, any>;
  created_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description?: string;
  icon_name?: string;
  requirement_type: string;
  requirement_value: number;
  color?: string;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
}

export interface ReadingActivity {
  id: string;
  user_id: string;
  activity_date: string;
  pages_read: number;
  reading_time_seconds: number;
  books_count: number;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  content?: string;
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

// Extended types with joined data
export interface BookWithProgress extends Book {
  reading_progress?: ReadingProgress;
}

export interface ReadingStat {
  day: string;
  minutes: number;
}

export interface AuthRequest extends Request {
  user?: User;
  userId?: string;
}

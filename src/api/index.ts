import { apiClient } from './client';
import { Book, ReadingStat, Insight } from '../types';

// Auth APIs
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    if (response.token) {
      apiClient.setToken(response.token);
    }
    return response;
  },

  register: async (email: string, password: string, username?: string) => {
    const response = await apiClient.post('/auth/register', { email, password, username });
    if (response.token) {
      apiClient.setToken(response.token);
    }
    return response;
  },

  getMe: async () => {
    return apiClient.get('/auth/me');
  },

  updateProfile: async (data: any) => {
    return apiClient.put('/auth/profile', data);
  },

  logout: () => {
    apiClient.clearToken();
  }
};

// Book APIs
export const booksApi = {
  getBooks: async (params?: { page?: number; limit?: number; search?: string; category?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.category) queryParams.append('category', params.category);

    const query = queryParams.toString();
    return apiClient.get(`/books${query ? `?${query}` : ''}`);
  },

  getBook: async (id: string) => {
    return apiClient.get(`/books/${id}`);
  },

  getRecentBook: async () => {
    return apiClient.get('/books/recent');
  },

  createBook: async (data: Partial<Book>) => {
    return apiClient.post('/books', data);
  },

  uploadBook: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = apiClient.getToken();
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

    const response = await fetch(`${API_BASE_URL}/books/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  },

  updateBook: async (id: string, data: Partial<Book>) => {
    return apiClient.put(`/books/${id}`, data);
  },

  deleteBook: async (id: string) => {
    return apiClient.delete(`/books/${id}`);
  }
};

// Reading progress APIs
export const readingApi = {
  getProgress: async (bookId: string) => {
    return apiClient.get(`/reading/progress/${bookId}`);
  },

  updateProgress: async (bookId: string, data: {
    current_page?: number;
    current_position?: any;
    progress_percentage?: number;
    is_finished?: boolean;
  }) => {
    return apiClient.put(`/reading/progress/${bookId}`, data);
  },

  startSession: async (bookId: string) => {
    return apiClient.post(`/reading/sessions/${bookId}/start`);
  },

  endSession: async (sessionId: string, data: {
    pages_read?: number;
    focus_score?: number;
  }) => {
    return apiClient.put(`/reading/sessions/${sessionId}/end`, data);
  }
};

// Bookmark APIs
export const bookmarksApi = {
  getBookmarks: async (bookId?: string) => {
    const query = bookId ? `?bookId=${bookId}` : '';
    return apiClient.get(`/bookmarks${query}`);
  },

  createBookmark: async (data: {
    book_id: string;
    page_number?: number;
    chapter?: string;
    position_json?: any;
    note?: string;
  }) => {
    return apiClient.post('/bookmarks', data);
  },

  deleteBookmark: async (id: string) => {
    return apiClient.delete(`/bookmarks/${id}`);
  }
};

// Quote APIs
export const quotesApi = {
  getQuotes: async (bookId?: string) => {
    const query = bookId ? `?bookId=${bookId}` : '';
    return apiClient.get(`/quotes${query}`);
  },

  createQuote: async (data: {
    book_id: string;
    content: string;
    page_number?: number;
    chapter?: string;
    tags?: string[];
    is_favorite?: boolean;
  }) => {
    return apiClient.post('/quotes', data);
  }
};

// Report APIs
export const reportsApi = {
  getWeeklyReport: async (startDate: string, endDate: string) => {
    return apiClient.get(`/reports/weekly?startDate=${startDate}&endDate=${endDate}`);
  },

  getWeeklyStats: async (weekStart: string) => {
    return apiClient.get<ReadingStat[]>(`/reports/weekly/stats?weekStart=${weekStart}`);
  },

  getInsights: async (limit: number = 10) => {
    return apiClient.get<Insight[]>(`/reports/insights?limit=${limit}`);
  },

  getHeatmap: async () => {
    return apiClient.get('/reports/heatmap');
  },

  getProfileStats: async () => {
    return apiClient.get('/reports/profile-stats');
  },

  getAchievements: async () => {
    return apiClient.get('/reports/achievements');
  }
};

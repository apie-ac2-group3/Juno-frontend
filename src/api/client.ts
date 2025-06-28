// API client for the custom FastAPI backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://0.0.0.0:8000';

export interface User {
  id: number;
  name: string;
  email: string;
  role: number;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface Session {
  id: number;
  token: string;
  expires_at: string;
  user: User;
}

export interface JournalEntry {
  journal_entry_id: number;
  user_id: number;
  entry_date: string;
  text?: string;
  sentiment_score?: number;
  ai_suggestion?: any;
  chat_log?: any;
  entry_status?: string;
  word_count: number;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  id: number;
  email: string;
  session: {
    token: string;
    expires_at: string;
  };
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    // Check for stored token on initialization
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add Authorization header if token exists
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Auth endpoints
  async register(name: string, email: string, password: string): Promise<User> {
    return this.request<User>('/login/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    // FastAPI uses Basic Auth for login
    const credentials = btoa(`${email}:${password}`);
    const response = await this.request<LoginResponse>('/login', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    });
    
    // Store the token
    this.setToken(response.session.token);
    return response;
  }

  async logout(): Promise<void> {
    this.clearToken();
    // Note: The backend doesn't have a logout endpoint, 
    // so we just clear the token locally
  }

  // Journal endpoints
  async getJournals(): Promise<JournalEntry[]> {
    return this.request<JournalEntry[]>('/journals');
  }

  async createJournal(): Promise<JournalEntry> {
    return this.request<JournalEntry>('/journals', {
      method: 'POST',
    });
  }

  async updateJournal(id: number, content: string): Promise<JournalEntry> {
    return this.request<JournalEntry>(`/journals/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  }

  async deleteJournal(id: number): Promise<void> {
    return this.request<void>(`/journals/${id}`, {
      method: 'DELETE',
    });
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }
}

// Export a singleton instance
export const apiClient = new ApiClient(); 
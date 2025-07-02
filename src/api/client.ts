// API client for the custom FastAPI backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Utility function to create user-friendly error messages
const createUserFriendlyError = (
  status: number,
  responseText: string
): string => {
  // Try to parse JSON error response
  let errorDetail = "";
  try {
    const errorObj = JSON.parse(responseText);
    errorDetail = errorObj.detail || errorObj.message || "";
  } catch {
    errorDetail = responseText;
  }

  // Map common HTTP status codes to user-friendly messages
  switch (status) {
    case 400:
      if (errorDetail.toLowerCase().includes("password")) {
        return "Please check your password and try again.";
      }
      if (errorDetail.toLowerCase().includes("email")) {
        return "Please check your email address and try again.";
      }
      return "Please check your information and try again.";

    case 401:
      return "Your session has expired. Please sign in again.";

    case 403:
      return "You don't have permission to perform this action.";

    case 404:
      if (errorDetail.toLowerCase().includes("user")) {
        return "Account not found. Please check your credentials or sign up.";
      }
      if (
        errorDetail.toLowerCase().includes("journal") ||
        errorDetail.toLowerCase().includes("entry")
      ) {
        return "Journal entry not found.";
      }
      return "The requested information could not be found.";

    case 409:
      if (errorDetail.toLowerCase().includes("email")) {
        return "An account with this email already exists. Please sign in instead.";
      }
      return "This information already exists. Please try something different.";

    case 422:
      return "Please check your information and try again.";

    case 429:
      return "Too many requests. Please wait a moment and try again.";

    case 500:
      return "Something went wrong on our end. Please try again later.";

    case 502:
    case 503:
    case 504:
      return "The service is temporarily unavailable. Please try again later.";

    default:
      // For unknown errors, provide a generic but helpful message
      if (
        errorDetail &&
        !errorDetail.includes("{") &&
        !errorDetail.includes("API Error")
      ) {
        return errorDetail;
      }
      return "Something went wrong. Please try again later.";
  }
};

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

export interface AnalysisResponse {
  sentimentScore: number;
  counsel: string;
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
    this.token = localStorage.getItem("auth_token");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
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
      const errorText = await response.text();
      const userFriendlyMessage = createUserFriendlyError(
        response.status,
        errorText
      );
      throw new Error(userFriendlyMessage);
    }

    // Handle empty responses (like DELETE operations)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    } else {
      // For non-JSON responses or empty responses, return null
      const text = await response.text();
      return text ? JSON.parse(text) : null;
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem("auth_token", token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("auth_token");
  }

  // Auth endpoints
  async register(name: string, email: string, password: string): Promise<User> {
    return this.request<User>("/login/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    // FastAPI uses Basic Auth for login
    const credentials = btoa(`${email}:${password}`);
    const response = await this.request<LoginResponse>("/login", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
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
    return this.request<JournalEntry[]>("/journals");
  }

  async createJournal(): Promise<JournalEntry> {
    return this.request<JournalEntry>("/journals", {
      method: "POST",
    });
  }

  async updateJournal(id: number, content: string): Promise<JournalEntry> {
    return this.request<JournalEntry>(`/journals/${id}`, {
      method: "PUT",
      body: JSON.stringify({ content }),
    });
  }

  async deleteJournal(id: number): Promise<void> {
    return this.request<void>(`/journals/${id}`, {
      method: "DELETE",
    });
  }

  async analyzeJournal(id: number): Promise<AnalysisResponse> {
    return this.request<AnalysisResponse>(`/analyze/${id}`, {
      method: "POST",
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

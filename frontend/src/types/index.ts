export interface ApiResponse<T> {
  message: string;
  data?: T;
  error?: unknown;
}

export interface ApiErrorResult {
  message: string;
  statusCode: number;
  errorObject: unknown;
}

export interface User {
  _id?: string;
  name: string;
  email: string;
}

export interface AuthStatusResponse {
  loggedIn: boolean;
  user: User | null;
}

export interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ChatMessage {
  _id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  user?: string;
  sessionId?: string;
  createdAt?: string;
}

export interface ChatSession {
  sessionId: string; 
  createdAt: string;
  title?: string;
}
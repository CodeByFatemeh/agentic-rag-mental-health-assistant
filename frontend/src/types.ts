export type ApiResponse<T> = {
  message: string;
  data?: T; // Data is optional for error responses
};

export type User = {
  name: string
  email: string
}

export type UserAuth = {
  isLoggedIn: boolean
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
}

export interface LoginFormValues {
  email: string
  password: string
}

export interface SignupFormValues {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export type Message = {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatMessage extends Message {
  _id?: string;
  user?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

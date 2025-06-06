import { Types } from 'mongoose';

// User interface for userSchema
export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  chats?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Chat interface for chatSchema
export interface IChat {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  sessionId?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: Record<string, any>;
  isDeleted?: boolean;
  createdAt?: Date;
}

// Generic API response type
export interface ApiResponse<T> {
  message: string;
  data: T;
}

// Auth response interfaces
export interface SignupResponse extends ApiResponse<IUser> {}
export interface LoginResponse extends ApiResponse<IUser> {}
export interface AuthStatusResponse {
  loggedIn: boolean;
  user: IUser | null;
}
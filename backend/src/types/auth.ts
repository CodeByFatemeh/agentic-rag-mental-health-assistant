import User from '../models/userSchema.js'

export interface SignupResponse {
  message: string
  user: typeof User
}

export interface LoginResponse {
  message: string
  user: typeof User
}

export interface AuthStatusResponse {
  loggedIn: boolean
  user: typeof User | null 
}

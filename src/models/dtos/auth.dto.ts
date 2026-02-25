import { UserRole } from "@/generated/prisma/client"

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  email: string
  password: string
  role?: UserRole
}

export interface AuthResponseDto {
  user: {
    id: string
    email: string
    role: UserRole
    isActive: boolean
    createdAt: Date
  }
  token: string
}
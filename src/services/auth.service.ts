import bcrypt from 'bcrypt'
import { prisma } from '@/config/database'
import { AppError } from '@/utils/app.error'
import { generateToken } from '@/utils/jwt'
import { RegisterDto, LoginDto, AuthResponseDto } from '@/models/dtos/auth.dto'

export class AuthService {
  async register(data: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existingUser) {
      throw new AppError('Email já está em uso', 400)
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: data.role || 'USER'
      }
    })

    const token = generateToken(user.id)

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt
      },
      token
    }
  }

  async login(data: LoginDto): Promise<AuthResponseDto> {
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (!user) {
      throw new AppError('Email ou senha inválidos', 401)
    }

    if (!user.isActive) {
      throw new AppError('Usuário desativado', 401)
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password)

    if (!isValidPassword) {
      throw new AppError('Email ou senha inválidos', 401)
    }

    const token = generateToken(user.id)

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt
      },
      token
    }
  }
}
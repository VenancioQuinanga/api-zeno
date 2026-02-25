import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '@/utils/jwt'
import { prisma } from '@/config/database'
import { AppError } from '@/utils/app.error'

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Token não fornecido', 401)
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      throw new AppError('Usuário não encontrado', 401)
    }

    if (!user.isActive) {
      throw new AppError('Usuário desativado', 401)
    }

    req.user = user
    next()
  } catch (error) {
    next(new AppError('Token inválido ou expirado', 401))
  }
}

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Não autorizado', 401))
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Permissão negada', 403))
    }

    next()
  }
}
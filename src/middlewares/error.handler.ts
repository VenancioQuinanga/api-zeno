import { Request, Response, NextFunction } from 'express'
import { AppError } from '@/utils/app.error'

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    })
  }

  console.error('Erro não tratado:', err)

  return res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor'
  })
}
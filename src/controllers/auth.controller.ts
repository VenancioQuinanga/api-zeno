import { Request, Response } from 'express'
import { AuthService } from '@/services/auth.service'
import { catchAsync } from '@/utils/catch.async'

const authService = new AuthService()

export const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.register(req.body)
  res.status(201).json(result)
})

export const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.login(req.body)
  res.json(result)
})

export const getProfile = catchAsync(async (req: Request, res: Response) => {
  res.json({ user: req.user as any})
})
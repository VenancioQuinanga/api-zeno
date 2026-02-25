import { Request, Response, NextFunction } from 'express'
import { ZodObject, ZodError, ZodRawShape } from 'zod'
import { AppError } from '@/utils/app.error'

export const validate = <T extends ZodRawShape>(schema: ZodObject<T>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      })
      next()

    } catch (error) {

      if (error instanceof ZodError) {
        const errors = error.issues.map(issue => ({
          path: issue.path.join('.'),
          message: issue.message
        }))
        next(new AppError(JSON.stringify(errors), 400))
      }
      next(error)
    }
  }
}
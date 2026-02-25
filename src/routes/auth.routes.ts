import { Router } from 'express'
import { register, login, getProfile } from '@/controllers/auth.controller'
import { authenticate } from '@/middlewares/auth'

const router = Router()

router.post('/register', authenticate, register)
router.post('/login', login)
router.get('/profile', authenticate, getProfile)

export default router
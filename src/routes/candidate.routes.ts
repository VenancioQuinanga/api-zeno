import { Router } from 'express'
import {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate
} from '@/controllers/candidate.controller'
import { authenticate, authorize } from '@/middlewares/auth'

const router = Router()

router.use(authenticate)

router.post('/', authorize('ADMIN', 'USER'), createCandidate)
router.get('/', authorize('ADMIN', 'USER', 'VIEWER'), getAllCandidates)
router.get('/:id', authorize('ADMIN', 'USER', 'VIEWER'), getCandidateById)
router.patch('/:id', authorize('ADMIN', 'USER'), updateCandidate)
router.delete('/:id', authorize('ADMIN'), deleteCandidate)

export default router

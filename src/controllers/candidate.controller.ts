import { Request, Response } from 'express'
import { CandidateService } from '@/services/candidate.service'
import { catchAsync } from '@/utils/catch.async'

const candidateService = new CandidateService()

export const createCandidate = catchAsync(async (req: Request, res: Response) => {
  const candidate = await candidateService.create(req.body)
  res.status(201).json(candidate)
})

export const getAllCandidates = catchAsync(async (req: Request, res: Response) => {
  const { status, search } = req.query
  
  let candidates
  if (status) {
    candidates = await candidateService.findByStatus(status as string)
  } else if (search) {
    candidates = await candidateService.search(search as string)
  } else {
    candidates = await candidateService.findAll()
  }
  
  res.json(candidates)
})

export const getCandidateById = catchAsync(async (req: Request, res: Response) => {
  const candidate = await candidateService.findById(req.params.id as string)
  res.json(candidate)
})

export const updateCandidate = catchAsync(async (req: Request, res: Response) => {
  const candidate = await candidateService.update(req.params.id as string, req.body)
  res.json(candidate)
})

export const deleteCandidate = catchAsync(async (req: Request, res: Response) => {
  await candidateService.delete(req.params.id as string)
  res.status(204).send()
})

import { Status } from "@/generated/prisma/client"

export interface CreateCandidateDto {
  name: string
  email: string
  phone?: string
  birthDate?: string
  position: string
  applicationDate?: Date
  status?: Status
  experience?: number
  skills: string[]
  notes?: string
  linkedin?: string
  portfolio?: string
  photoUrl?: string
}

export interface UpdateCandidateDto extends Partial<CreateCandidateDto> {}

export interface CandidateResponseDto {
  id: string
  name: string
  email: string
  phone?: string | null
  birthDate?: string | null
  position: string
  applicationDate: Date
  status: Status
  experience?: number | null
  skills: string[]
  notes?: string | null
  linkedin?: string | null
  portfolio?: string | null
  photoUrl?: string | null
  createdAt: Date
  updatedAt: Date
}
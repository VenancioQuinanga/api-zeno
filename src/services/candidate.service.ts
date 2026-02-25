import { prisma } from '@/config/database'
import { AppError } from '@/utils/app.error'
import { CreateCandidateDto, UpdateCandidateDto, CandidateResponseDto } from '@/models/dtos/candidate.dto'

export class CandidateService {
  async create(data: CreateCandidateDto): Promise<CandidateResponseDto> {
    const existingCandidate = await prisma.candidate.findUnique({
      where: { email: data.email }
    })

    if (existingCandidate) {
      throw new AppError('Candidato com este email já existe', 400)
    }
    
    const applicationDate = data.applicationDate 
      ? new Date(data.applicationDate).toISOString()
      : new Date().toISOString()

    const candidate = await prisma.candidate.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        birthDate: data.birthDate,
        position: data.position,
        applicationDate: applicationDate,
        status: data.status || 'pending',
        experience: data.experience,
        skills: data.skills,
        notes: data.notes,
        linkedin: data.linkedin,
        portfolio: data.portfolio
      }
    })

    return candidate
  }

  async findAll(): Promise<CandidateResponseDto[]> {
    return prisma.candidate.findMany({
      orderBy: { createdAt: 'desc' }
    })
  }

  async findById(id: string): Promise<CandidateResponseDto> {
    const candidate = await prisma.candidate.findUnique({
      where: { id }
    })

    if (!candidate) {
      throw new AppError('Candidato não encontrado', 404)
    }

    return candidate
  }

  async update(id: string, data: UpdateCandidateDto): Promise<CandidateResponseDto> {
    await this.findById(id)

    const candidate = await prisma.candidate.update({
      where: { id },
      data
    })

    return candidate
  }

  async delete(id: string): Promise<void> {
    await this.findById(id)
    await prisma.candidate.delete({ where: { id } })
  }

  async findByStatus(status: string): Promise<CandidateResponseDto[]> {
    return prisma.candidate.findMany({
      where: { status: status as any },
      orderBy: { createdAt: 'desc' }
    })
  }

  async search(query: string): Promise<CandidateResponseDto[]> {
    return prisma.candidate.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { position: { contains: query, mode: 'insensitive' } },
          { skills: { has: query } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    })
  }
}
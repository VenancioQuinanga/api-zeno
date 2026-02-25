import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

interface TokenPayload {
  userId: string
}

export const generateToken = (userId: string): string => {
  const payload: TokenPayload = { userId }
  
  return jwt.sign(
    payload,           
    JWT_SECRET, 
    { expiresIn: JWT_EXPIRES_IN as any}
  )
}

export const verifyToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload
    return decoded
  } catch (error) {
    throw new Error('Token inválido')
  }
}